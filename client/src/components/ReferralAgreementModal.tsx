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
    propertyLinks: ["" , "", ""],
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
    form.contactName.trim().length >= 2;

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
      providerNotes: `Silara Marketing Referral Agreement v06. ABN: ${form.abn}. Phone: ${form.phone}. Email: ${form.email}. Property Links: ${form.propertyLinks.filter(l => l.trim()).join(', ') || 'None provided'}.`,
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
            <h2 className="font-bold font-heading text-lg">Silara Marketing — Referral Agreement</h2>
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
                <Label className="text-navy font-semibold text-sm mb-2 block">Property Links / Brochures <span className="text-gray-400 font-normal">(optional — one link per line)</span></Label>
                <p className="text-xs text-gray-500 mb-2">Add links to your property listings, brochures, or virtual tours. Add as many as needed.</p>
                {form.propertyLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      value={link}
                      onChange={(e) => {
                        const updated = [...form.propertyLinks];
                        updated[idx] = e.target.value;
                        setForm({ ...form, propertyLinks: updated });
                      }}
                      placeholder={`Property link ${idx + 1} (e.g. https://...)`}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal outline-none"
                    />
                    {form.propertyLinks.length > 1 && (
                      <button type="button" onClick={() => setForm({ ...form, propertyLinks: form.propertyLinks.filter((_, i) => i !== idx) })} className="text-gray-400 hover:text-red-500 transition-colors px-2">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setForm({ ...form, propertyLinks: [...form.propertyLinks, ""] })} className="text-xs text-teal font-semibold hover:underline mt-1">+ Add another link</button>
              </div>

              {!canProceedFromDetails && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">Please complete all required fields including ABN before continuing.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Agreement Text ── */}
          {step === "agreement" && (
            <div>
              <div className="bg-navy/5 rounded-xl p-4 mb-5 text-sm">
                <p className="font-bold text-navy font-heading mb-1">Silara Marketing — Referral Agreement</p>
                <p className="text-gray-500 text-xs">Silara Marketing (ACN 688042177) · Version No: 06</p>
              </div>

              <AgreementSection title="1. Parties and Program" defaultOpen={true}>
                <p>This Agreement is made between <strong>Silara Marketing</strong> (ACN 688 042 177) ("Silara Marketing") and the accommodation provider identified below (the "Provider"). The parties intend this Agreement to be legally binding.</p>
                <p><strong>{form.organisationName}</strong> (ABN: {form.abn}) ("Provider")</p>
                <p>Contact: {form.contactName}{form.contactTitle ? `, ${form.contactTitle}` : ""} · {form.email} · {form.phone}</p>
                <p className="mt-2 text-gray-600">Silara Marketing operates the Accommodation Provider Growth Program (APGP), under which it sources, qualifies and matches NDIS participants ("Participants") to accommodation held or managed by the Provider. The Provider may accept or decline any Participant at its absolute discretion. Silara Marketing acts on a best-efforts basis and gives no warranty as to Introductions, occupancy, or commercial outcomes.</p>
              </AgreementSection>

              <AgreementSection title="2. Referral Fee">
                <div className="rounded-lg border border-teal/30 bg-teal-light p-3 text-xs">
                  <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1"><span>Referral Fee per Successful Referral (exclusive of GST)</span><strong>$3,000.00</strong><span>Goods and Services Tax (10%)</span><strong>$300.00</strong><span className="font-semibold text-navy">Total payable per Successful Referral (inclusive of GST)</span><strong className="text-navy">$3,300.00</strong></div>
                </div>
                <p>The Referral Fee is fixed. No quotation or other pricing document applies. It is payable only on a Successful Referral, and no amount is payable unless and until a Successful Referral occurs.</p>
                <p>No upfront fee, deposit, joining fee, subscription, periodic charge, advertising cost or assessment fee is payable. Only one Referral Fee is payable per Participant, regardless of accommodation duration, properties presented, or subsequent transfer between properties held or managed by the Provider.</p>
                <p>All amounts are payable by the Provider alone. No fee, charge, commission or cost is charged to, recovered from, or passed on to a Participant, their family, nominee, support coordinator, or NDIS plan.</p>
                {form.propertyLinks.filter(l => l.trim()).length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-navy text-xs mb-1">Property Links / Brochures submitted:</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {form.propertyLinks.filter(l => l.trim()).map((link, i) => (
                        <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="text-teal text-xs hover:underline break-all">{link}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
              </AgreementSection>

              <AgreementSection title="3. Successful Referral">
                <p>A <strong>Successful Referral</strong> occurs when both: (a) Silara Marketing provides the Provider with the Participant Evaluation Form or the Participant&apos;s identifying details (an "Introduction"); and (b) the Participant or authorised decision-maker executes a service agreement, residential tenancy agreement or occupancy agreement with the Provider or a Related Entity for accommodation held or managed by the Provider.</p>
                <p>The Referral Fee is earned on the date of first execution of that agreement (the "Agreement Date"). Occupancy commencement is not required.</p>
                <p>No Referral Fee is payable where the Participant withdraws, chooses another provider, does not obtain necessary funding or approval, is declined by the Provider, or does not execute an agreement described above. A "Related Entity" includes an entity controlling, controlled by, or under common control with the Provider, and any director, partner, trustee or associated business.</p>
              </AgreementSection>

              <AgreementSection title="4. Invoicing and Payment">
                <p>Silara Marketing will issue a valid tax invoice on or after the Agreement Date. The Provider must pay within <strong>fourteen (14) days</strong> of invoice date.</p>
                <p>The Provider must notify Silara Marketing in writing within <strong>five (5) business days</strong> of execution of an agreement described in section 3, or a decision not to proceed, and confirm the execution date on request.</p>
                <p>For an unpaid invoice, a one-time late payment fee equal to <strong>ten per cent (10%)</strong> of the total invoice amount may be charged after written notice. No interest is charged on overdue amounts.</p>
              </AgreementSection>

              <AgreementSection title="5. Referral Entitlement and Non-Circumvention">
                <p>An Introduction is registered when made and remains in effect indefinitely. The Referral Fee remains payable on a Successful Referral, regardless of elapsed time, property, re-engagement through any third party, or provision by a Related Entity.</p>
                <p>The Provider must not structure, defer, redirect or re-characterise a placement through a Related Entity or third party to avoid or reduce the Referral Fee. Participants remain free to select any provider, property or support arrangement at all times. This section survives termination.</p>
              </AgreementSection>

              <AgreementSection title="6. Participant Privacy and Confidentiality">
                <p>Participant Information includes all information made available about a Participant, including contact, NDIS, funding, disability, health, support needs and the Participant Evaluation Form. The Provider may use it only to assess, respond to and, if the referral proceeds, accommodate and support that Participant.</p>
                <p>The Provider must not market to, add to a marketing list, sell, share or trade Participant Information, and must securely destroy or permanently de-identify it within <strong>seven (7) days</strong> after a referral will not proceed. The Provider must notify Silara Marketing within <strong>24 hours</strong> of any unauthorised access, loss or disclosure.</p>
              </AgreementSection>

              <AgreementSection title="7. Compliance and Participant Safeguards">
                <p>Participants retain full choice and control. APGP is a business-to-business arrangement between Silara Marketing and the Provider. Silara Marketing will obtain consent before disclosing Participant Information and disclose the commercial referral arrangement to the Participant.</p>
                <p>Each party must comply with applicable law, including the National Disability Insurance Scheme Act 2013 (Cth), NDIS Code of Conduct, Privacy Act 1988 (Cth), Spam Act 2003 (Cth) and Australian Consumer Law.</p>
              </AgreementSection>

              <AgreementSection title="8. APGP Terms of Service (MOU)">
                <p>This Agreement incorporates the APGP Terms of Service (MOU), available at:</p>
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline text-xs font-medium">View APGP Terms of Service (MOU) →</a>
                <p className="mt-2">The Provider acknowledges it has read and agrees to be bound by the APGP Terms of Service (MOU). If there is an inconsistency, <strong>this Agreement prevails</strong>, including for the Referral Fee in section 2.</p>
              </AgreementSection>

              <AgreementSection title="9. Term and Termination">
                <p>This Agreement commences on execution and continues until either party gives <strong>thirty (30) days&apos; written notice</strong>. Termination does not affect fees already incurred or a Referral Fee that becomes payable for a Participant introduced before termination. Sections 2 to 7 survive termination.</p>
              </AgreementSection>

              <AgreementSection title="10. Governing Law and Execution">
                <p>This Agreement is governed by the laws of New South Wales and the parties submit to the non-exclusive jurisdiction of its courts.</p>
                <p>This Agreement may be executed electronically and in counterparts, each of which constitutes an original.</p>
                <div className="mt-3 bg-gray-50 rounded-xl p-4 text-xs space-y-1">
                  <p className="font-bold text-navy">For Silara Marketing (ACN 688042177)</p>
                  <p>Signature: <span className="italic text-gray-400">(to be executed by Silara Marketing)</span></p>
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
                <p className="text-xs text-gray-500">Agreement: <strong className="text-navy">Silara Marketing Referral Agreement v06</strong></p>
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
                    <strong className="text-navy">I am duly authorised</strong> by {form.organisationName} to sign this Referral Agreement with Silara Marketing (ACN 688042177) on behalf of the organisation.
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
                    and the terms of this Silara Marketing Referral Agreement v06, and I understand that this constitutes a legally binding commitment.
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
                {expressInterest.isPending ? "Submitting..." : "Sign & Submit Agreement"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
