import { useState } from "react";
import { CheckCircle2, ArrowRight, Home, Users, Clock, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PublicLayout from "@/components/PublicLayout";
import Animate from "@/components/Animate";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

const CARE_FOR = ["Myself", "A loved one", "A client"] as const;
const REQUESTER_TYPES = ["Self", "Family member / carer", "Support coordinator", "Plan manager", "Other"] as const;
const NDIS_STATUS = ["Yes", "No", "In progress"] as const;
const ACCOMMODATION_TYPES = [
  "SDA (Specialist Disability Accommodation)",
  "SIL (Supported Independent Living)",
  "STA (Short-Term Accommodation / Respite)",
  "MTA (Medium-Term Accommodation)",
  "Not sure",
] as const;
const DWELLING_TYPES = ["Apartment", "House", "Group home", "Villa / unit", "Any suitable"] as const;
const SDA_CATEGORIES = ["Improved Liveability", "Fully Accessible", "Robust", "High Physical Support", "Not sure", "N/A"] as const;
const TIMELINES = ["Immediately", "Within 30 days", "Within 60 days", "Within 90 days", "Unsure"] as const;
const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT", "Any"] as const;

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all",
        selected
          ? "bg-teal text-white border-teal shadow-sm"
          : "bg-white text-gray-700 border-gray-200 hover:border-teal hover:bg-teal-light"
      )}
    >
      {selected && <CheckCircle2 className="w-4 h-4 inline mr-2 shrink-0" />}
      {label}
    </button>
  );
}

export default function RequestAccommodation() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    careFor: "" as typeof CARE_FOR[number] | "",
    requesterType: "" as typeof REQUESTER_TYPES[number] | "",
    ndisRegistered: "" as typeof NDIS_STATUS[number] | "",
    accommodationType: "" as typeof ACCOMMODATION_TYPES[number] | "",
    dwellingType: "" as typeof DWELLING_TYPES[number] | "",
    sdaCategory: "" as typeof SDA_CATEGORIES[number] | "",
    moveInTimeline: "" as typeof TIMELINES[number] | "",
    preferredState: "Any" as typeof STATES[number],
    supportNeeds: "",
  });

  const submit = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => toast.error(err.message),
  });

  const steps = [
    { n: 1, label: "About You", icon: <Users className="w-4 h-4" /> },
    { n: 2, label: "Accommodation", icon: <Home className="w-4 h-4" /> },
    { n: 3, label: "Timeline", icon: <Clock className="w-4 h-4" /> },
    { n: 4, label: "Review", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const canProceed = () => {
    if (step === 1) return form.careFor && form.requesterType && form.ndisRegistered;
    if (step === 2) return form.accommodationType && form.dwellingType;
    if (step === 3) return form.moveInTimeline;
    return true;
  };

  const handleSubmit = () => {
    if (!form.careFor || !form.requesterType || !form.ndisRegistered || !form.accommodationType || !form.dwellingType || !form.moveInTimeline) {
      toast.error("Please complete all required fields.");
      return;
    }
    submit.mutate({
      careFor: form.careFor as typeof CARE_FOR[number],
      requesterType: form.requesterType as typeof REQUESTER_TYPES[number],
      ndisRegistered: form.ndisRegistered as typeof NDIS_STATUS[number],
      accommodationType: form.accommodationType as typeof ACCOMMODATION_TYPES[number],
      dwellingType: form.dwellingType as typeof DWELLING_TYPES[number],
      sdaCategory: form.sdaCategory as typeof SDA_CATEGORIES[number] || undefined,
      moveInTimeline: form.moveInTimeline as typeof TIMELINES[number],
      preferredState: form.preferredState as typeof STATES[number],
      supportNeeds: form.supportNeeds || undefined,
    });
  };

  if (submitted) {
    return (
      <PublicLayout>
        <section className="min-h-[70vh] flex items-center justify-center bg-white py-20">
          <div className="container max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-teal-light flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-teal" />
            </div>
            <h1 className="text-3xl font-bold text-navy font-heading mb-4">Request Submitted</h1>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Thank you — your accommodation request has been submitted anonymously to our network of registered NDIS accommodation providers.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              If a provider is interested in assisting with your request, the APGP team will be in touch to connect you. Your personal details have not been shared with any provider at this stage.
            </p>
            <div className="bg-teal-light rounded-2xl p-6 text-left mb-8">
              <h3 className="font-bold text-navy font-heading mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {["Your request is visible to APGP-registered accommodation providers", "Providers can express interest in assisting with your request", "APGP reviews all expressions of interest before making contact", "You will be contacted by the APGP team — not directly by providers"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <a href="/">
              <Button className="bg-teal hover:bg-teal-600 text-white px-8">Back to Home</Button>
            </a>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-12 lg:py-16">
        <div className="container max-w-2xl text-center">
          <Animate variant="bottom" delay={0}>
            <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">For Participants &amp; Families</div>
          </Animate>
          <Animate variant="bottom" delay={0.1}>
            <h1 className="text-3xl lg:text-4xl font-extrabold font-heading mb-4">Request NDIS Accommodation</h1>
          </Animate>
          <Animate variant="bottom" delay={0.2}>
            <p className="text-gray-300 leading-relaxed">
              Submit your accommodation request anonymously. Your request will be visible to our network of registered NDIS accommodation providers. No personal information is shared until you choose to proceed.
            </p>
          </Animate>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container max-w-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className={cn("flex items-center gap-2 shrink-0", step >= s.n ? "text-teal" : "text-gray-400")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors", step > s.n ? "bg-teal border-teal text-white" : step === s.n ? "border-teal text-teal bg-white" : "border-gray-300 text-gray-400 bg-white")}>
                    {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                  </div>
                  <span className="hidden sm:block text-xs font-medium">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-3 transition-colors", step > s.n ? "bg-teal" : "bg-gray-200")} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            {/* Step 1: About You */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-navy font-semibold text-base mb-3 block">Who is this request for? *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CARE_FOR.map((opt) => (
                      <OptionButton key={opt} label={opt} selected={form.careFor === opt} onClick={() => setForm({ ...form, careFor: opt })} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-navy font-semibold text-base mb-3 block">Who is making this request? *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {REQUESTER_TYPES.map((opt) => (
                      <OptionButton key={opt} label={opt} selected={form.requesterType === opt} onClick={() => setForm({ ...form, requesterType: opt })} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-navy font-semibold text-base mb-3 block">Is the participant NDIS registered? *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {NDIS_STATUS.map((opt) => (
                      <OptionButton key={opt} label={opt} selected={form.ndisRegistered === opt} onClick={() => setForm({ ...form, ndisRegistered: opt })} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Accommodation */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-navy font-semibold text-base mb-3 block">What type of accommodation is needed? *</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {ACCOMMODATION_TYPES.map((opt) => (
                      <OptionButton key={opt} label={opt} selected={form.accommodationType === opt} onClick={() => setForm({ ...form, accommodationType: opt })} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-navy font-semibold text-base mb-3 block">Preferred dwelling type? *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DWELLING_TYPES.map((opt) => (
                      <OptionButton key={opt} label={opt} selected={form.dwellingType === opt} onClick={() => setForm({ ...form, dwellingType: opt })} />
                    ))}
                  </div>
                </div>
                {(form.accommodationType === "SDA (Specialist Disability Accommodation)") && (
                  <div>
                    <Label className="text-navy font-semibold text-base mb-3 block">SDA design category (if known)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {SDA_CATEGORIES.map((opt) => (
                        <OptionButton key={opt} label={opt} selected={form.sdaCategory === opt} onClick={() => setForm({ ...form, sdaCategory: opt })} />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-navy font-semibold text-base mb-3 block">Preferred state / territory</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {STATES.map((opt) => (
                      <OptionButton key={opt} label={opt} selected={form.preferredState === opt} onClick={() => setForm({ ...form, preferredState: opt })} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Timeline + Notes */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-navy font-semibold text-base mb-3 block">When is accommodation needed? *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TIMELINES.map((opt) => (
                      <OptionButton key={opt} label={opt} selected={form.moveInTimeline === opt} onClick={() => setForm({ ...form, moveInTimeline: opt })} />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-navy font-semibold text-base mb-2 block">
                    Additional support needs or notes <span className="text-gray-400 font-normal text-sm">(optional)</span>
                  </Label>
                  <p className="text-xs text-gray-500 mb-2">Do not include any personal identifying information. This will be visible to providers.</p>
                  <Textarea
                    value={form.supportNeeds}
                    onChange={(e) => setForm({ ...form, supportNeeds: e.target.value })}
                    placeholder="e.g. High physical support needs, requires accessible bathroom, needs 24-hour support..."
                    rows={4}
                    maxLength={500}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">{form.supportNeeds.length}/500</p>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                <h3 className="font-bold text-navy font-heading text-lg">Review Your Request</h3>
                <p className="text-sm text-gray-500">Please review your request before submitting. No personal information is included — this request will be anonymous.</p>
                <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                  {[
                    { label: "Request for", value: form.careFor },
                    { label: "Submitted by", value: form.requesterType },
                    { label: "NDIS registered", value: form.ndisRegistered },
                    { label: "Accommodation type", value: form.accommodationType },
                    { label: "Dwelling type", value: form.dwellingType },
                    { label: "SDA category", value: form.sdaCategory || "N/A" },
                    { label: "Move-in timeline", value: form.moveInTimeline },
                    { label: "Preferred state", value: form.preferredState },
                    { label: "Support needs", value: form.supportNeeds || "Not specified" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between gap-4">
                      <span className="text-gray-500 shrink-0">{row.label}</span>
                      <span className="text-navy font-medium text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-teal-light border border-teal/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Heart className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      By submitting, you confirm that no personal identifying information has been included in this request. Your request will be visible to APGP-registered accommodation providers. The APGP team will contact you if a suitable match is found.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep((s) => (s - 1) as Step)} className="border-gray-200 text-gray-600">
                  Back
                </Button>
              ) : <div />}
              {step < 4 ? (
                <Button
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  disabled={!canProceed()}
                  className="bg-teal hover:bg-teal-600 text-white disabled:opacity-50"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submit.isPending}
                  className="bg-teal hover:bg-teal-600 text-white"
                >
                  {submit.isPending ? "Submitting..." : "Submit Request"}
                  {!submit.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
