import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const destination = location.state?.from || "/orphans";

  if (user) {
    return <Navigate to={destination} replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      toast({
        title: "Welcome back",
        description: "Admin login successful.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to login.";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-foreground text-background grid place-items-center px-4">
      <section className="w-full max-w-md border border-background/20 p-8 md:p-10 bg-background/5 backdrop-blur-sm">
        <p className="text-xs tracking-[0.25em] uppercase text-background/60 mb-4">Khidmat Aghosh</p>
        <h1 className="text-4xl font-display mb-2">Admin Sign In</h1>
        <p className="text-sm text-background/70 mb-8">Use your admin email and password to access the dashboard.</p>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-background/80">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="bg-background text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-background/80">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="bg-background text-foreground"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-background/80">
          <Link to="/forgot-password" className="underline underline-offset-4">Forgot password?</Link>
          <Link to="/" className="underline underline-offset-4">Back to site</Link>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
