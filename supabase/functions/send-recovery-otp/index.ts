import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SUPER_ADMIN_EMAIL = Deno.env.get("SUPER_ADMIN_EMAIL") || "hassaanuq@gmail.com";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") || "";
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

  if (!BREVO_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: "Server env configuration is incomplete." }, 500);
  }

  try {
    const { adminEmail } = await request.json();

    if (!adminEmail || typeof adminEmail !== "string") {
      return jsonResponse({ error: "adminEmail is required." }, 400);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from("admin_profiles")
      .select("user_id,email")
      .eq("email", adminEmail)
      .maybeSingle();

    if (adminError) {
      return jsonResponse({ error: adminError.message }, 500);
    }

    if (!adminProfile) {
      return jsonResponse({ error: "Admin account not found." }, 404);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await sha256(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await supabaseAdmin.from("admin_recovery_otps").insert({
      admin_email: adminEmail,
      recipient_email: SUPER_ADMIN_EMAIL,
      otp_hash: otpHash,
      expires_at: expiresAt,
    });

    if (insertError) {
      return jsonResponse({ error: insertError.message }, 500);
    }

    const emailPayload = {
      sender: { email: "no-reply@khidmat-aghosh.local", name: "Khidmat Aghosh" },
      to: [{ email: SUPER_ADMIN_EMAIL, name: "Super Admin" }],
      subject: "Admin Recovery OTP",
      textContent: `Admin (${adminEmail}) requested account recovery. OTP: ${otp}. Expires in 10 minutes.`,
      htmlContent: `<p>Admin <strong>${adminEmail}</strong> requested account recovery.</p><p>OTP: <strong>${otp}</strong></p><p>This OTP expires in 10 minutes.</p>`,
    };

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!brevoResponse.ok) {
      const body = await brevoResponse.text();
      return jsonResponse({ error: `Brevo request failed: ${body}` }, 500);
    }

    return jsonResponse({ message: "OTP sent to super admin email." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return jsonResponse({ error: message }, 500);
  }
});
