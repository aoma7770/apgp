import { useState } from "react";
import APGPLogo from "@/components/APGPLogo";
import { Link } from "wouter";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProviderForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const resetRequest = trpc.provider.requestPasswordReset.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: { message: string }) => {
      // Don't reveal if email exists or not — just show success
      setSubmitted(true);
      console.error("[PasswordReset]", err.message);
    },
  });

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-navy font-heading mb-3">Check your email</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            If an account exists for <strong>{email}</strong>, we've sent a password reset link. Please check your inbox and spam folder.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            The reset link expires in 1 hour. If you don't receive an email, contact us at{" "}
            <a href="mailto:support@apgpaccommodation.com.au" className="text-teal hover:underline">
              support@apgpaccommodation.com.au
            </a>
          </p>
          <Link href="/provider/login">
            <Button className="bg-teal hover:bg-teal-600 text-white w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <APGPLogo variant="compact" height={36} />
          <div>
            <div className="font-bold text-navy font-heading text-sm">APGP Portal</div>
            <div className="text-xs text-teal">Provider Access</div>
          </div>
        </Link>

        <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center mb-5">
          <Mail className="w-6 h-6 text-teal" />
        </div>

        <h1 className="text-2xl font-bold text-navy font-heading mb-2">Forgot your password?</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Enter the email address you registered with and we'll send you a reset link.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); resetRequest.mutate({ email }); }} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-navy font-medium text-sm">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@yourorganisation.com.au"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 border-gray-200 focus:border-teal"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-teal hover:bg-teal-600 text-white font-semibold h-11"
            disabled={resetRequest.isPending}
          >
            {resetRequest.isPending ? "Sending..." : "Send Reset Link"}
            {!resetRequest.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/provider/login" className="text-sm text-gray-500 hover:text-navy transition-colors">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
