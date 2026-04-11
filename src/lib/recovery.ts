import { supabase } from "@/integrations/supabase/client";

interface RecoveryOtpPayload {
  adminEmail: string;
}

interface VerifyRecoveryPayload {
  adminEmail: string;
  otp: string;
  newEmail: string;
  newPassword: string;
}

export async function sendRecoveryOtp(payload: RecoveryOtpPayload) {
  const { data, error } = await supabase.functions.invoke("send-recovery-otp", {
    body: payload,
  });

  if (error) throw error;
  return data;
}

export async function verifyRecoveryOtp(payload: VerifyRecoveryPayload) {
  const { data, error } = await supabase.functions.invoke("verify-recovery-otp", {
    body: payload,
  });

  if (error) throw error;
  return data;
}
