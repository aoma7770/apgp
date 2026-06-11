import { useState, useEffect } from "react";
import APGPLogo from "@/components/APGPLogo";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Settings, ArrowRight, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ADMIN_TOKEN_KEY = "apgp_admin_token";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  // On mount, verify the token is still valid server-side before auto-redirecting
  const { data: me, isLoading: meLoading } = trpc.adminAuth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0, // always re-fetch on mount — never use cached result
  });

  useEffect(() => {
    // Only redirect if the server confirms the session is valid
    if (!meLoading && me) {
      // Redirect to the matching dashboard URL
      const isStaffUrl = window.location.pathname.startsWith('/staff');
      setLocation(isStaffUrl ? '/staff/dashboard' : '/admin/dashboard');
    } else if (!meLoading && !me) {
      // Clear any stale token
      try { localStorage.removeItem('apgp_admin_token'); } catch { /* ignore */ }
    }
  }, [me, meLoading, setLocation]);

  const login = trpc.adminAuth.login.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        try { localStorage.setItem(ADMIN_TOKEN_KEY, data.token); } catch { /* ignore */ }
      }
      toast.success(`Welcome, ${data.admin.fullName ?? data.admin.username}`);
      setLocation("/admin/dashboard");
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <APGPLogo variant="compact" height={40} />
          <div>
            <div className="font-bold text-white font-heading">APGP</div>
            <div className="text-xs text-teal-300">by Ausnew Support Services</div>
          </div>
        </Link>
        <div>
          <div className="w-16 h-16 rounded-2xl bg-teal/20 flex items-center justify-center mb-6">
            <Settings className="w-8 h-8 text-teal-300" />
          </div>
          <h2 className="text-3xl font-bold font-heading text-white mb-4">Admin Portal</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Restricted access for the Ausnew admin team. Manage participant leads, provider listings, blog content, and all backend operations.
          </p>
          <div className="space-y-3">
            {[
              "Manage and moderate participant leads",
              "Hide, edit, or remove leads as needed",
              "Search and browse all provider properties",
              "Manage blog content and posts",
              "Super admin: manage admin team members",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-teal-300 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-400 leading-relaxed">
                This portal is restricted to authorised Ausnew admin team members only. Providers should use the{" "}
                <Link href="/provider/login" className="text-teal-300 hover:text-teal transition-colors">Provider Portal</Link>{" "}
                instead.
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">← Back to APGP website</Link>
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <APGPLogo variant="compact" height={36} />
            <div className="font-bold text-white font-heading text-sm">APGP Admin Portal</div>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-teal/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-teal-300" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading mb-2">Admin Sign In</h1>
            <p className="text-gray-400 text-sm">Sign in with your admin username and password.</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); login.mutate(form); }}
            className="space-y-5"
          >
            <div>
              <Label className="text-gray-300 font-medium text-sm mb-1.5 block">Username</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="your.username"
                required
                autoComplete="username"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-teal"
              />
            </div>
            <div>
              <Label className="text-gray-300 font-medium text-sm mb-1.5 block">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-teal pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-teal hover:bg-teal-500 text-white font-semibold h-12"
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in..." : "Sign In to Admin Portal"}
              {!login.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              This login is for the Ausnew admin team only. If you are an accommodation provider,{" "}
              <Link href="/provider/login" className="text-teal-300 hover:text-teal transition-colors">
                use the Provider Portal
              </Link>{" "}
              instead.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              ← Back to APGP website
            </Link>
            <button
              type="button"
              onClick={() => { try { localStorage.removeItem('apgp_admin_token'); } catch { /* ignore */ } window.location.reload(); }}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
