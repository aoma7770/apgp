import { useState } from "react";
import APGPLogo from "@/components/APGPLogo";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { TOKEN_KEY } from "@/contexts/ProviderAuthContext";

export default function ProviderLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const login = trpc.provider.login.useMutation({
    onSuccess: (data) => {
      // Store token in localStorage so it's sent as Bearer header on subsequent requests
      if (data.token) {
        try { localStorage.setItem(TOKEN_KEY, data.token); } catch { /* ignore */ }
      }
      toast.success("Welcome back!");
      setLocation("/provider/dashboard");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero text-white flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3">
          <APGPLogo variant="compact" height={40} />
          <div>
            <div className="font-bold text-white font-heading">APGP</div>
            <div className="text-xs text-teal-300">by Ausnew Support Services</div>
          </div>
        </Link>
        <div>
          <h2 className="text-3xl font-bold font-heading mb-4">Provider Portal</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Sign in to manage your company profile, view and update your accommodation listings, and track your partnership status with Ausnew Support Services.
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Don't have an account?{" "}
          <Link href="/provider/register" className="text-teal-300 hover:text-teal transition-colors">
            Register free
          </Link>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <APGPLogo variant="compact" height={36} />
            <div className="font-bold text-navy font-heading text-sm">APGP by Ausnew</div>
          </Link>

          <h1 className="text-2xl font-bold text-navy font-heading mb-2">Provider Sign In</h1>
          <p className="text-gray-500 text-sm mb-8">
            New to APGP?{" "}
            <Link href="/provider/register" className="text-teal hover:underline font-medium">
              Create a free account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
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
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in..." : "Sign In"}
              {!login.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Internal Ausnew staff?{" "}
              <Link href="/staff/login" className="text-navy hover:underline font-medium">
                Admin login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}