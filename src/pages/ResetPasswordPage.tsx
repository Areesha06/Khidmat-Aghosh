import { FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ResetPasswordPage = () => {
  const { updatePassword, session } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const { toast } = useToast();

  if (!session && isDone) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please type the same password in both fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword(password);
      setIsDone(true);
      toast({
        title: "Password updated",
        description: "Sign in again with your new password.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update password.";
      toast({ title: "Failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground grid place-items-center px-4">
      <section className="w-full max-w-lg border border-border p-8 md:p-10 bg-card">
        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">Email Reset Flow</p>
        <h1 className="text-4xl font-display mb-2">Set New Password</h1>
        <p className="text-sm text-muted-foreground mb-8">Choose a new password for your admin account.</p>

        {isDone ? (
          <div className="space-y-4">
            <p className="text-sm">Your password has been updated.</p>
            <Link to="/login" className="underline underline-offset-4 text-sm">Go to Login</Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
};

export default ResetPasswordPage;
