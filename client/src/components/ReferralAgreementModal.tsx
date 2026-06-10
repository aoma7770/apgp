import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, AlertCircle, Pen, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Provider {
  id: number;
  email: string;
  organisationName?: string | null;
  abn?: string | null;
  contactName?: string | null;
  contactTitle?: string | null;
  phone?: string | null;
  companyType?: string | null;
}

interface ReferralAgreementModalProps {
  leadId: number;
  leadSummary: string;
  provider: Provider;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "details" | "agreement" | "sign";

// Simple canvas signature pad
function SignaturePad({ onSave }: { onSave: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#0d2b4e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      drawing.current = true;
      const pos = getPos(e, canvas);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!drawing.current) return;
      e.preventDefault();
      const pos = getPos(e, canvas);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setHasSignature(true);
    };
    const stop = () => {
      if (drawing.current) {
        drawing.current = false;
        onSave(canvas.toDataURL());
      }
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stop);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stop);
    };
  }, [onSave]);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSave("");
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 relative">
        <canvas
          ref={canvasRef}
          width={580}
          height={120}
          className="w-full touch-none cursor-crosshair"
          style={{ display: "block" }}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <Pen className="w-4 h-4" /> Sign here
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors"
      >
        <RotateCcw className="w-3 h-3" /> Clear signature
      </button>
    </div>
  );
}

function AgreementSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-semibold text-navy text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 py-4 text-sm text-gray-700 leading-relaxed space-y-2">{children}</div>}
    </div>
  );
}

export default function ReferralAgreementModal({
  leadId,
  leadSummary,
  provider,
  onClose,
  onSuccess,
}: ReferralAgreementModalProps) {
  const [step, setStep] = useState<Step>("details");
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [form, setForm] = useState({
    organisationName: provider.organisationName ?? "",
    abn: provider.abn ?? "",
    contactName: provider.contactName ?? "",
    contactTitle: provider.contactTitle ?? "",
    phone: provider.phone ?? "",
    email: provider.email,
    partnershipModel: "" as "Referral Partnership" | "Joint Venture Partnership" | "",
    authorisedCheckbox: false,
    termsCheckbox: false,
  });
  const today = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  const expressInterest = trpc.leads.expressInterest.useMutation({
    onSuccess: () => {
      toast.success("Agreement signed and submitted. Our team will be in touch shortly.");
      onSuccess();
    },
    onError: (err) => toast.error(err.message),
  });

  // Australian ABN is 11 digits. Accept 9-11 digits to be flexible.
  const abnDigits = form.abn.replace(/[\s-]/g, "");
  const canProceedFromDetails = form.organisationName.trim().length >= 2 &&
    abnDigits.length >= 9 && abnDigits.length <= 11 && /^\d+$/.test(abnDigits) &&
    form.contactName.trim().length >= 2 &&
    form.partnershipModel !== "";

  const canSubmit = canProceedFromDetails &&
    form.authorisedCheckbox &&
    form.termsCheckbox &&
    signatureDataUrl.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    expressInterest.mutate({
      leadId,
      signatoryName: form.contactName,
      signatoryOrg: form.organisationName,
      providerNotes: `Partnership Model: ${form.partnershipModel}. ABN: ${form.abn}. Phone: ${form.phone}. Email: ${form.email}.`,
      referralAgreementSigned: true,
      consentSigned: true,
    });
  };

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/65 backdrop-blur-sm" style={{ zIndex: 99998 }} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 99999,
          width: "calc(100vw - 2rem)",
          maxWidth: "720px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          background: "white",
          borderRadius: "1rem",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-navy text-white shrink-0">
          <div>
            <h2 className="font-bold font-heading text-lg">APGP — Referral &amp; Joint Venture Agreement</h2>
            <p className="text-xs text-teal-300 mt-0.5">
              {step === "details" ? "Step 1 of 3 — Your Details" : step === "agreement" ? "Step 2 of 3 — Read the Agreement" : "Step 3 of 3 — Sign &amp; Submit"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead summary bar */}
        <div className="px-6 py-2.5 bg-teal-light border-b border-teal/20 shrink-0">
          <p className="text-xs text-gray-600"><span className="font-semibold text-navy">Enquiry:</span> {leadSummary}</p>
        </div>

        {/* Step progress */}
        <div className="flex border-b border-gray-100 shrink-0">
          {(["details", "agreement", "sign"] as Step[]).map((s, i) => (
            <div key={s} className={`flex-1 py-2.5 text-center text-xs font-semibold border-b-2 transition-colors ${step === s ? "border-teal text-teal" : step > s ? "border-green-500 text-green-600" : "border-transparent text-gray-400"}`}>
              {step > s ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> : null}
              {i + 1}. {s === "details" ? "Your Details" : s === "agreement" ? "Agreement" : "Sign"}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Step 1: Provider Details ── */}
          {step === "details" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Please confirm your organisation details. These will be included in the signed agreement. <strong className="text-navy">ABN is required</strong> to execute this agreement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-navy font-semibold text-sm">Organisation / Provider Name *</Label>
                  <Input value={form.organisationName} onChange={(e) => setForm({ ...form, organisationName: e.target.value })} placeholder="Legal entity name" className="mt-1.5" required />
                </div>
                <div>
                  <Label className="text-navy font-semibold text-sm">ABN * <span className="text-red-500">(required — 9 to 11 digits)</span></Label>
                  <Input value={form.abn} onChange={(e) => setForm({ ...form, abn: e.target.value })} placeholder="e.g. 12 345 678 901" className={`mt-1.5 ${form.abn && (abnDigits.length < 9 || !/^\d+$/.test(abnDigits)) ? 'border-red-400' : ''}`} required />
                  {form.abn && abnDigits.length < 9 && <p className="text-xs text-red-500 mt-1">ABN must be at least 9 digits</p>}
                </div>
                <div>
                  <Label className="text-navy font-semibold text-sm">Contact Name *</Label>
                  <Input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="Authorised signatory name" className="mt-1.5" required />
                </div>
                <div>
                  <Label className="text-navy font-semibold text-sm">Title / Role</Label>
                  <Input value={form.contactTitle} onChange={(e) => setForm({ ...form, contactTitle: e.target.value })} placeholder="e.g. Director, CEO" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-navy font-semibold text-sm">Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Contact phone number" className="mt-1.5" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-navy font-semibold text-sm">Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label className="text-navy font-semibold text-sm mb-2 block">Partnership Model * <span className="text-gray-400 font-normal">(select one)</span></Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(["Referral Partnership", "Joint Venture Partnership"] as const).map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => setForm({ ...form, partnershipModel: model })}
                      className={`p-4 rounded-xl border text-left transition-all ${form.partnershipModel === model ? "bg-teal text-white border-teal" : "bg-white border-gray-200 hover:border-teal"}`}
                    >
                      {form.partnershipModel === model && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
                      <span className="font-semibold text-sm">{model}</span>
                      <p className={`text-xs mt-1 ${form.partnershipModel === model ? "text-white/80" : "text-gray-500"}`}>
                        {model === "Referral Partnership" ? "Success-based placement fee — pay only when participant moves in" : "Shared supports model — no placement fee when Ausnew delivers community access"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {!canProceedFromDetails && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">Please complete all required fields including ABN and select a partnership model before continuing.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Agreement Text ── */}
          {step === "agreement" && (
            <div>
              <div className="bg-navy/5 rounded-xl p-4 mb-5 text-sm">
                <p className="font-bold text-navy font-heading mb-1">APGP — Referral &amp; Joint Venture Agreement</p>
                <p className="text-gray-500 text-xs">MOU - APGP · Version No: 01 · Version Date: 06/01/2026</p>
              </div>

              <AgreementSection title="1. Parties" defaultOpen={true}>
                <p>This Agreement is entered into between:</p>
                <p><strong>Ausnew Support Services Pty Ltd</strong> ("Ausnew"), and</p>
                <p><strong>{form.organisationName}</strong> (ABN: {form.abn}) ("Provider")</p>
                <p>Contact: {form.contactName}{form.contactTitle ? `, ${form.contactTitle}` : ""} · {form.email} · {form.phone}</p>
                <p className="mt-2 text-gray-600">The Provider wishes to participate in the Accommodation Provider Growth Program (APGP), under which Ausnew may introduce Participants to the Provider and, where applicable, collaborate under a referral and/or joint venture arrangement. This Agreement is intended to be legally binding.</p>
              </AgreementSection>

              <AgreementSection title="2. Partnership Model Election">
                <p>The Provider has elected to participate under:</p>
                <p className="font-bold text-navy">☑ {form.partnershipModel}</p>
                <p className="text-gray-600 mt-1">The rights and obligations applicable to each partnership model are governed by the APGP Terms of Service (MOU).</p>
              </AgreementSection>

              <AgreementSection title="3. Fees and Quote">
                <p><strong>3.1 Quote:</strong> Prior to execution of this Agreement, Ausnew will issue the Provider with a written quote setting out the applicable commercial fees for participation in the APGP ("Quote").</p>
                <p><strong>3.2 Fees:</strong> The Provider agrees to pay Ausnew the fees set out in the Quote issued by Ausnew. The Quote forms part of the commercial understanding between the parties and sets out the applicable fees, including (where applicable): Placement Fee; Vacancy Protection Plan (if elected); and any other agreed fees.</p>
                <p><strong>3.3 Binding Effect of Quote:</strong> By executing this Agreement, the Provider acknowledges that the Quote accurately reflects the agreed commercial terms and the Provider is bound to pay the fees set out in the Quote.</p>
                <p><strong>3.4 Provider-Only Fees:</strong> All fees payable under this Agreement and any Quote are <strong>payable by the Accommodation Provider only</strong> and are <strong>not charged to Participants, their families, or their NDIS plans</strong>.</p>
              </AgreementSection>

              <AgreementSection title="4. Incorporation of APGP Terms of Service (MOU)">
                <p>This Agreement incorporates by reference the <strong>Accommodation Provider Growth Program – Terms of Service (MOU)</strong>, available at:</p>
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline text-xs font-medium">View APGP Terms of Service (MOU) →</a>
                <p className="mt-2">The Provider acknowledges that: it has read and understands the APGP Terms of Service (MOU); the APGP Terms of Service (MOU) forms part of this Agreement; and it agrees to be bound by the APGP Terms of Service (MOU), as amended from time to time.</p>
                <p>In the event of any inconsistency, <strong>this Agreement prevails</strong> to the extent of the inconsistency.</p>
              </AgreementSection>

              <AgreementSection title="5. Term and Termination">
                <p>This Agreement commences on the date of execution and continues until terminated by either party on <strong>thirty (30) days' written notice</strong>, subject to accrued rights and obligations.</p>
                <p>Termination does not affect: fees already incurred or payable; or obligations that survive termination under the APGP Terms of Service (MOU).</p>
              </AgreementSection>

              <AgreementSection title="6. Compliance and Participant Safeguards">
                <p>The Provider acknowledges that: all Participants retain full choice and control; no fees are charged to Participants; and the APGP is a business-to-business commercial arrangement.</p>
                <p>Each party must comply with all applicable laws, including the <strong>NDIS Act</strong>, <strong>NDIS Code of Conduct</strong>, and <strong>Australian Consumer Law</strong>.</p>
              </AgreementSection>

              <AgreementSection title="7. Governing Law">
                <p>This Agreement is governed by the laws of <strong>New South Wales</strong>, and the parties submit to the non-exclusive jurisdiction of the courts of that State.</p>
              </AgreementSection>

              <AgreementSection title="8. Execution">
                <p>This Agreement may be executed electronically and in counterparts, each of which constitutes an original.</p>
                <div className="mt-3 bg-gray-50 rounded-xl p-4 text-xs space-y-1">
                  <p className="font-bold text-navy">For Ausnew Support Services Pty Ltd</p>
                  <p>Signature: <span className="italic text-gray-400">(to be executed by Ausnew)</span></p>
                </div>
                <div className="mt-3 bg-teal-light rounded-xl p-4 text-xs space-y-1">
                  <p className="font-bold text-navy">For {form.organisationName}</p>
                  <p>Name: {form.contactName}</p>
                  <p>Title: {form.contactTitle || "—"}</p>
                  <p>Date: {today}</p>
                  <p className="italic text-gray-500">(Signature to be provided on next step)</p>
                </div>
              </AgreementSection>
            </div>
          )}

          {/* ── Step 3: Sign ── */}
          {step === "sign" && (
            <div className="space-y-5">
              <div className="bg-navy/5 rounded-xl p-4">
                <p className="text-sm font-semibold text-navy mb-1">Executing as: {form.organisationName}</p>
                <p className="text-xs text-gray-500">ABN: {form.abn} · {form.contactName}{form.contactTitle ? `, ${form.contactTitle}` : ""}</p>
                <p className="text-xs text-gray-500">Partnership Model: <strong className="text-navy">{form.partnershipModel}</strong></p>
                <p className="text-xs text-gray-500">Date: {today}</p>
              </div>

              <div>
                <Label className="text-navy font-semibold text-sm mb-2 block">
                  <Pen className="w-3.5 h-3.5 inline mr-1.5" />
                  Your Signature *
                </Label>
                <SignaturePad onSave={setSignatureDataUrl} />
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.authorisedCheckbox}
                    onChange={(e) => setForm({ ...form, authorisedCheckbox: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-teal shrink-0"
                  />
                  <span className="text-sm text-gray-700">
                    <strong className="text-navy">I am duly authorised</strong> by {form.organisationName} to sign this Referral &amp; Joint Venture Agreement on behalf of the organisation.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.termsCheckbox}
                    onChange={(e) => setForm({ ...form, termsCheckbox: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-teal shrink-0"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and agree to the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline font-medium">APGP Terms of Service (MOU)</a>{" "}
                    and the terms of this Agreement, and I understand that this constitutes a legally binding commitment.
                  </span>
                </label>
              </div>

              {!canSubmit && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    {!signatureDataUrl ? "Please draw your signature above. " : ""}
                    {!form.authorisedCheckbox || !form.termsCheckbox ? "Please tick both checkboxes to confirm." : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <div>
            {step !== "details" && (
              <button
                type="button"
                onClick={() => setStep(step === "sign" ? "agreement" : "details")}
                className="text-sm text-gray-500 hover:text-navy transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-sm text-gray-500 hover:text-navy transition-colors">Cancel</button>
            {step === "details" && (
              <Button
                onClick={() => setStep("agreement")}
                disabled={!canProceedFromDetails}
                className="bg-teal hover:bg-teal-600 text-white disabled:opacity-50"
              >
                Continue to Agreement →
              </Button>
            )}
            {step === "agreement" && (
              <Button onClick={() => setStep("sign")} className="bg-teal hover:bg-teal-600 text-white">
                I Have Read the Agreement — Sign →
              </Button>
            )}
            {step === "sign" && (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || expressInterest.isPending}
                className="bg-teal hover:bg-teal-600 text-white disabled:opacity-50"
              >
                {expressInterest.isPending ? "Submitting..." : "Sign &amp; Submit to Ausnew Team"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
