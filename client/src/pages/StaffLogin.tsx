import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Shield, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function StaffLogin() {
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
          <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center text-white font-bold text-lg font-heading">A</div>
          <div>
            <div className="font-bold text-white font-heading">APGP</div>
            <div className="text-xs text-teal-300">by Ausnew Support Services</div>
          </div>
        </Link>
        <div>
          <div className="w-16 h-16 rounded-2xl bg-teal/20 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-teal-300" />
          </div>
          <h2 className="text-3xl font-bold font-heading text-white mb-4">Staff Portal</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Restricted access for internal Ausnew Support Services staff. This portal provides access to all provider accommodation listings and property search tools.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-teal-300 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Access to this portal is restricted to authorised Ausnew staff only. Providers should use the{" "}
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
            <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center text-white font-bold font-heading">A</div>
            <div className="font-bold text-white font-heading text-sm">APGP Staff Portal</div>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-teal/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-teal-300" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading mb-2">Staff Sign In</h1>
            <p className="text-gray-400 text-sm">
              Authorised Ausnew staff only. Sign in with your Ausnew account.
            </p>
          </div>

          <a href={getLoginUrl()} className="block">
            <Button size="lg" className="w-full bg-teal hover:bg-teal-500 text-white font-semibold h-12">
              Sign In with Ausnew Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              This login is for internal Ausnew staff only. If you are an accommodation provider,{" "}
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
