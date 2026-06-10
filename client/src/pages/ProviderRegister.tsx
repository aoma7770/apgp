import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, ArrowRight, CheckCircle2, Building2, User, Phone, Mail, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { TOKEN_KEY } from "@/contexts/ProviderAuthContext";
import { cn } from "@/lib/utils";
import APGPLogo from "@/components/APGPLogo";

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

type Step = 1 | 2 | 3;

function StepIndicator({ current, total }: { current: Step; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
            current > s ? "bg-teal border-teal text-white" :
            current === s ? "border-teal text-teal bg-white" :
            "border-gray-200 text-gray-400 bg-white"
          )}>
            {current > s ? <CheckCircle2 className="w-4 h-4" /> : s}
          </div>
          {i < total - 1 && <div className={cn("h-0.5 w-8 transition-colors", current > s ? "bg-teal" : "bg-gray-200")} />}
        </div>
      ))}
    </div>
  );
}

function ToggleButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
        selected ? "bg-teal text-white border-teal shadow-sm" : "bg-white text-gray-700 border-gray-200 hover:border-teal hover:bg-teal-light"
      )}
    >
      {selected && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" />}
      {label}
    </button>
  );
}

export default function ProviderRegister() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const [form, setForm] = useState({
    // Step 1 — Organisation
    organisationName: "",
    abn: "",
    companyType: "" as "SDA" | "SIL" | "Both" | "",
    hasVacancies: null as boolean | null,
    // Step 2 — Contact
    contactName: "",
    contactTitle: "",
    phone: "",
    // Step 3 — Account
    email: "",
    password: "",
  });

  const register = trpc.provider.register.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        try { localStorage.setItem(TOKEN_KEY, data.token); } catch { /* ignore */ }
      }
      toast.success("Welcome to APGP! Your account has been created.");
      setLocation("/provider/dashboard");
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleState = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const canProceed = () => {
    if (step === 1) return form.organisationName.trim().length >= 2 && form.companyType && form.hasVacancies !== null;
    if (step === 2) return form.contactName.trim().length >= 2 && form.phone.trim().length >= 6;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    register.mutate({
      email: form.email,
      password: form.password,
      organisationName: form.organisationName || undefined,
      abn: form.abn || undefined,
      contactName: form.contactName || undefined,
      contactTitle: form.contactTitle || undefined,
      phone: form.phone || undefined,
      companyType: form.companyType as "SDA" | "SIL" | "Both" | undefined || undefined,
      regionsServiced: selectedStates.join(",") || undefined,
      hasVacancies: form.hasVacancies ?? undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 gradient-hero text-white flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3">
          <APGPLogo variant="compact" height={40} />
          <div>
            <div className="font-bold text-white font-heading">APGP</div>
            <div className="text-xs text-teal-300">by Ausnew Support Services</div>
          </div>
        </Link>

        <div>
          <h2 className="text-3xl font-bold font-heading mb-6 leading-snug">
            Join Australia's Leading NDIS Accommodation Growth Program
          </h2>
          <ul className="space-y-4">
            {[
              "Free account — no credit card, no commitment",
              "Access the live participant enquiries feed immediately",
              "List your SDA and SIL vacancies in minutes",
              "Pay only when a participant moves in",
              "Ausnew handles the full intake process for you",
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
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg py-6">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <APGPLogo variant="compact" height={36} />
            <div className="font-bold text-navy font-heading text-sm">APGP by Ausnew</div>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-navy font-heading">Create Your Free Account</h1>
            <p className="text-gray-500 text-sm mt-1">
              Step {step} of 3 —{" "}
              {step === 1 ? "Your Organisation" : step === 2 ? "Contact Details" : "Account Setup"}
            </p>
          </div>

          <StepIndicator current={step} total={3} />

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep((s) => (s + 1) as Step); }} className="space-y-5">

            {/* ── Step 1: Organisation ── */}
            {step === 1 && (
              <>
                <div>
                  <Label className="text-navy font-semibold text-sm mb-1.5 block">
                    <Building2 className="w-3.5 h-3.5 inline mr-1.5" />
                    Organisation / Provider Name *
                  </Label>
                  <Input
                    value={form.organisationName}
                    onChange={(e) => setForm({ ...form, organisationName: e.target.value })}
                    placeholder="e.g. Sunrise Disability Housing Pty Ltd"
                    required
                    className="border-gray-200 focus:border-teal"
                  />
                </div>

                <div>
                  <Label className="text-navy font-semibold text-sm mb-1.5 block">
                    ABN <span className="text-gray-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    value={form.abn}
                    onChange={(e) => setForm({ ...form, abn: e.target.value })}
                    placeholder="e.g. 12 345 678 901"
                    className="border-gray-200 focus:border-teal"
                  />
                </div>

                <div>
                  <Label className="text-navy font-semibold text-sm mb-2 block">
                    Type of Accommodation Provider *
                  </Label>
                  <div className="flex gap-3 flex-wrap">
                    {(["SDA", "SIL", "Both"] as const).map((type) => (
                      <ToggleButton
                        key={type}
                        label={type === "Both" ? "Both SDA & SIL" : type}
                        selected={form.companyType === type}
                        onClick={() => setForm({ ...form, companyType: type })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-navy font-semibold text-sm mb-2 block">
                    <MapPin className="w-3.5 h-3.5 inline mr-1.5" />
                    States / Territories You Operate In
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {STATES.map((state) => (
                      <ToggleButton
                        key={state}
                        label={state}
                        selected={selectedStates.includes(state)}
                        onClick={() => toggleState(state)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-navy font-semibold text-sm mb-2 block">
                    Do you currently have accommodation vacancies? *
                  </Label>
                  <div className="flex gap-3">
                    <ToggleButton
                      label="Yes — I have vacancies"
                      selected={form.hasVacancies === true}
                      onClick={() => setForm({ ...form, hasVacancies: true })}
                    />
                    <ToggleButton
                      label="No — not yet"
                      selected={form.hasVacancies === false}
                      onClick={() => setForm({ ...form, hasVacancies: false })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Step 2: Contact Details ── */}
            {step === 2 && (
              <>
                <div>
                  <Label className="text-navy font-semibold text-sm mb-1.5 block">
                    <User className="w-3.5 h-3.5 inline mr-1.5" />
                    Contact Name *
                  </Label>
                  <Input
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    placeholder="Full name of primary contact"
                    required
                    className="border-gray-200 focus:border-teal"
                  />
                </div>

                <div>
                  <Label className="text-navy font-semibold text-sm mb-1.5 block">
                    Role / Position <span className="text-gray-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    value={form.contactTitle}
                    onChange={(e) => setForm({ ...form, contactTitle: e.target.value })}
                    placeholder="e.g. Director, Operations Manager, CEO"
                    className="border-gray-200 focus:border-teal"
                  />
                </div>

                <div>
                  <Label className="text-navy font-semibold text-sm mb-1.5 block">
                    <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                    Phone Number *
                  </Label>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0400 000 000"
                    required
                    className="border-gray-200 focus:border-teal"
                  />
                </div>

                <div className="bg-teal-light rounded-xl p-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <strong className="text-navy">What happens next?</strong> Once you create your account, you'll have immediate access to the live participant enquiries feed and your provider dashboard. Our team will be in touch within 1–2 business days to discuss your partnership options.
                  </p>
                </div>
              </>
            )}

            {/* ── Step 3: Account Setup ── */}
            {step === 3 && (
              <>
                <div className="bg-navy/5 rounded-2xl p-5 mb-2">
                  <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Registering as</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-teal" />
                    </div>
                    <div>
                      <p className="font-bold text-navy">{form.organisationName}</p>
                      <p className="text-xs text-gray-500">{form.companyType} Provider · {selectedStates.join(", ") || "All states"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-navy font-semibold text-sm mb-1.5 block">
                    <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@yourorganisation.com.au"
                    required
                    className="border-gray-200 focus:border-teal"
                  />
                  <p className="text-xs text-gray-400 mt-1">This will be your login email</p>
                </div>

                <div>
                  <Label className="text-navy font-semibold text-sm mb-1.5 block">
                    Choose a Password *
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      className="border-gray-200 focus:border-teal pr-10"
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

                <p className="text-xs text-gray-400 leading-relaxed">
                  By creating an account, you confirm that all partnership arrangements are business-to-business and separate from NDIS funding processes. You agree to our{" "}
                  <Link href="/terms" className="text-teal hover:underline">Terms of Service</Link>.
                </p>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-2">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="border-gray-200 text-gray-600"
                >
                  Back
                </Button>
              ) : <div />}

              {step < 3 ? (
                <Button
                  type="submit"
                  disabled={!canProceed()}
                  className="bg-teal hover:bg-teal-600 text-white disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={register.isPending || !form.email || !form.password}
                  className="bg-teal hover:bg-teal-600 text-white disabled:opacity-50"
                >
                  {register.isPending ? "Creating account..." : "Create Free Account"}
                  {!register.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/provider/login" className="text-teal hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
