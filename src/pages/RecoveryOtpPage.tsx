import { FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { sendRecoveryOtp, verifyRecoveryOtp } from "@/lib/recovery";

const RecoveryOtpPage = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [adminEmail, setAdminEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const onResendOtp = async () => {
    if (!adminEmail) {
      toast({ title: "Missing email", description: "Add current admin email first.", variant: "destructive" });
      return;
    }

    setIsResending(true);
    try {
      await sendRecoveryOtp({ adminEmail });
      toast({
        title: "OTP resent",
        description: "A new OTP has been sent to hassaanuq@gmail.com.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not resend OTP.";
      toast({ title: "Failed", description: message, variant: "destructive" });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await verifyRecoveryOtp({
        adminEmail,
        otp,
        newEmail,
        newPassword,
      });
      toast({
        title: "Recovery successful",
        description: "Admin email and password updated. Sign in with the new email.",
      });
      setOtp("");
      setNewPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not verify OTP.";
      toast({ title: "Verification failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background grid place-items-center px-4 py-10">
      <section className="w-full max-w-xl border border-border p-8 md:p-10 bg-card">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Super Admin Verification</p>
        <h1 className="text-4xl font-display mb-2">Enter OTP and Change Email</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Get the OTP from super admin, then update the admin email and password in one step.
        </p>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Current Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">OTP From Super Admin</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              placeholder="6-digit OTP"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-email">New Admin Email</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Applying changes..." : "Verify OTP and Update Email"}
          </Button>
        </form>

        <Button variant="outline" className="w-full mt-4" onClick={onResendOtp} disabled={isResending}>
          {isResending ? "Sending OTP..." : "Resend OTP to hassaanuq@gmail.com"}
        </Button>

        <div className="mt-6 text-sm flex justify-between">
          <Link to="/forgot-password" className="underline underline-offset-4">Back</Link>
          <Link to="/login" className="underline underline-offset-4">Go to login</Link>
        </div>
      </section>
    </main>
  );
};

export default RecoveryOtpPage;
