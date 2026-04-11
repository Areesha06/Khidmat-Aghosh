import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { sendRecoveryOtp } from "@/lib/recovery";

const ForgotPasswordPage = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [isRecoverySubmitting, setIsRecoverySubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onRequestReset = async (event: FormEvent) => {
    event.preventDefault();
    setIsResetSubmitting(true);

    try {
      await requestPasswordReset(email);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for the password reset link.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send reset email.";
      toast({
        title: "Request failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const onNoEmailAccess = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Provide the current admin email first.",
        variant: "destructive",
      });
      return;
    }

    setIsRecoverySubmitting(true);
    try {
      await sendRecoveryOtp({ adminEmail: email });
      toast({
        title: "OTP sent",
        description: "An OTP was sent to hassaanuq@gmail.com.",
      });
      navigate(`/recovery-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start recovery flow.";
      toast({
        title: "Recovery failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsRecoverySubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground grid place-items-center px-4">
      <section className="w-full max-w-lg border border-border p-8 md:p-10 bg-card">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Password Recovery</p>
        <h1 className="text-4xl font-display mb-2">Forgot Password</h1>
        <p className="text-sm text-muted-foreground mb-8">
          If you still control your admin email, use the reset link flow. If not, request an OTP to the super admin.
        </p>

        <form className="space-y-5" onSubmit={onRequestReset}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Current Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isResetSubmitting}>
            {isResetSubmitting ? "Sending reset link..." : "Send Password Reset Email"}
          </Button>
        </form>

        <div className="my-8 border-t border-border" />

        <Button variant="outline" className="w-full" onClick={onNoEmailAccess} disabled={isRecoverySubmitting}>
          {isRecoverySubmitting ? "Requesting OTP..." : "I do not have access to this email"}
        </Button>

        <div className="mt-6 text-sm flex justify-between">
          <Link to="/login" className="underline underline-offset-4">Back to login</Link>
          <Link to="/" className="underline underline-offset-4">Back to site</Link>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
