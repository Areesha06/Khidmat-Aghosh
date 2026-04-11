import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function sha256(content: string) {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(content));
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: "Server env configuration is incomplete." }, 500);
  }

  try {
    const { adminEmail, otp, newEmail, newPassword } = await request.json();

    if (!adminEmail || !otp || !newEmail || !newPassword) {
      return jsonResponse({ error: "adminEmail, otp, newEmail and newPassword are required." }, 400);
    }

    if (newPassword.length < 8) {
      return jsonResponse({ error: "newPassword must contain at least 8 characters." }, 400);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: otpRow, error: otpError } = await supabaseAdmin
      .from("admin_recovery_otps")
      .select("id, otp_hash, attempts, expires_at, used_at")
      .eq("admin_email", adminEmail)
      .is("used_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) {
      return jsonResponse({ error: otpError.message }, 500);
    }

    if (!otpRow) {
      return jsonResponse({ error: "No pending OTP found." }, 404);
    }

    if (new Date(otpRow.expires_at).getTime() < Date.now()) {
      return jsonResponse({ error: "OTP has expired." }, 400);
    }

    const otpHash = await sha256(otp);
    if (otpHash !== otpRow.otp_hash) {
      await supabaseAdmin
        .from("admin_recovery_otps")
        .update({ attempts: otpRow.attempts + 1 })
        .eq("id", otpRow.id);

      return jsonResponse({ error: "Invalid OTP." }, 400);
    }

    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from("admin_profiles")
      .select("user_id")
      .eq("email", adminEmail)
      .maybeSingle();

    if (profileError) {
      return jsonResponse({ error: profileError.message }, 500);
    }

    if (!adminProfile) {
      return jsonResponse({ error: "Admin account not found." }, 404);
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(adminProfile.user_id, {
      email: newEmail,
      password: newPassword,
      email_confirm: true,
    });

    if (updateError) {
      return jsonResponse({ error: updateError.message }, 500);
    }

    const { error: profileUpdateError } = await supabaseAdmin
      .from("admin_profiles")
      .update({ email: newEmail, updated_at: new Date().toISOString() })
      .eq("user_id", adminProfile.user_id);

    if (profileUpdateError) {
      return jsonResponse({ error: profileUpdateError.message }, 500);
    }

    const { error: markUsedError } = await supabaseAdmin
      .from("admin_recovery_otps")
      .update({ used_at: new Date().toISOString() })
      .eq("id", otpRow.id);

    if (markUsedError) {
      return jsonResponse({ error: markUsedError.message }, 500);
    }

    return jsonResponse({ message: "Admin credentials updated successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonResponse({ error: message }, 500);
  }
});
