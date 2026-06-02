import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProviderRegister() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", organisationName: "" });

  const register = trpc.provider.register.useMutation({
    onSuccess: () => {
      toast.success("Account created! Welcome to APGP.");
      setLocation("/provider/dashboard");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    register.mutate(form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero text-white flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center text-white font-bold text-lg font-heading">A</div>
          <div>
            <div className="font-bold text-white font-heading">APGP</div>
            <div className="text-xs text-teal-300">by Ausnew Support Services</div>
          </div>
        </Link>
        <div>
          <h2 className="text-3xl font-bold font-heading mb-6">Join the Accommodation Provider Growth Program</h2>
          <ul className="space-y-4">
            {[
              "Free provider account — no credit card required",
              "Create your company profile and list your properties",
              "Connect with Ausnew's participant pipeline",
              "Manage all your SDA and SIL vacancies in one place",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/provider/login" className="text-teal-300 hover:text-teal transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center text-white font-bold font-heading">A</div>
            <div className="font-bold text-navy font-heading text-sm">APGP by Ausnew</div>
          </Link>

          <h1 className="text-2xl font-bold text-navy font-heading mb-2">Create your free account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Already registered?{" "}
            <Link href="/provider/login" className="text-teal hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="org" className="text-navy font-medium text-sm">Organisation Name <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Input
                id="org"
                type="text"
                placeholder="e.g. Sunrise Disability Housing"
                value={form.organisationName}
                onChange={(e) => setForm({ ...form, organisationName: e.target.value })}
                className="mt-1.5 border-gray-200 focus:border-teal focus:ring-teal"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-navy font-medium text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@yourorganisation.com.au"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="mt-1.5 border-gray-200 focus:border-teal focus:ring-teal"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-navy font-medium text-sm">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  className="border-gray-200 focus:border-teal focus:ring-teal pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-teal hover:bg-teal-600 text-white font-semibold h-11"
              disabled={register.isPending}
            >
              {register.isPending ? "Creating account..." : "Create Free Account"}
              {!register.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center leading-relaxed">
            By registering, you agree that all partnership arrangements are business-to-business and separate from NDIS funding processes.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center lg:hidden">
            <p className="text-sm text-gray-500">
              Internal staff?{" "}
              <Link href="/staff/login" className="text-navy hover:underline font-medium">
                Staff login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
