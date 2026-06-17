import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Shield, ArrowRight, Lock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import APGPLogo from "@/components/APGPLogo";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin" || user.role === "staff") {
        setLocation("/staff/dashboard");
      }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <APGPLogo variant="compact" height={40} />
          <div>
            <div className="font-bold text-white font-heading">APGP</div>
            <div className="text-xs text-teal-300">Internal Admin Portal</div>
          </div>
        </Link>
        <div>
          <div className="w-16 h-16 rounded-2xl bg-teal/20 flex items-center justify-center mb-6">
            <Settings className="w-8 h-8 text-teal-300" />
          </div>
          <h2 className="text-3xl font-bold font-heading text-white mb-4">Admin Portal</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Restricted access for the APGP admin team. Manage participant leads, provider listings, property search, blog content, and all backend operations.
          </p>
          <div className="space-y-3">
            {[
              "Manage and moderate participant leads",
              "Hide, edit, or remove leads as needed",
              "Search and browse all provider properties",
              "Manage blog content and posts",
              "Full backend access",
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
                Access to this portal is restricted to authorised APGP admin team members only. Providers should use the{" "}
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
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <APGPLogo variant="compact" height={36} />
            <div className="font-bold text-white font-heading text-sm">APGP Admin Portal</div>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-teal/20 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-teal-300" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading mb-2">Admin Sign In</h1>
            <p className="text-gray-400 text-sm">
              Authorised APGP admin team only. Sign in with your admin account.
            </p>
          </div>

          <a href={getLoginUrl()} className="block">
            <Button size="lg" className="w-full bg-teal hover:bg-teal-500 text-white font-semibold h-12">
              Sign In to Admin Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              This login is for the APGP admin team only. If you are an accommodation provider,{" "}
              <Link href="/provider/login" className="text-teal-300 hover:text-teal transition-colors">
                use the Provider Portal
              </Link>{" "}
              instead.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              ← Back to APGP website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}