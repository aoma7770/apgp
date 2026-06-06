import { useState } from "react";
import { X, CheckCircle2, FileText, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ReferralAgreementModalProps {
  leadId: number;
  leadSummary: string;
  providerName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReferralAgreementModal({
  leadId,
  leadSummary,
  providerName,
  onClose,
  onSuccess,
}: ReferralAgreementModalProps) {
  const [tab, setTab] = useState<"referral" | "consent">("referral");
  const [referralRead, setReferralRead] = useState(false);
  const [consentRead, setConsentRead] = useState(false);
  const [form, setForm] = useState({
    signatoryName: "",
    signatoryOrg: providerName,
    providerNotes: "",
  });

  const expressInterest = trpc.leads.expressInterest.useMutation({
    onSuccess: () => {
      toast.success("Interest submitted. The Ausnew team will be in touch.");
      onSuccess();
    },
    onError: (err) => toast.error(err.message),
  });

  const canSubmit = referralRead && consentRead && form.signatoryName.trim().length >= 2 && form.signatoryOrg.trim().length >= 2;

  const handleSubmit = () => {
    if (!canSubmit) return;
    expressInterest.mutate({
      leadId,
      signatoryName: form.signatoryName,
      signatoryOrg: form.signatoryOrg,
      providerNotes: form.providerNotes || undefined,
      referralAgreementSigned: true,
      consentSigned: true,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ padding: "1rem" }}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: "100%", maxWidth: "680px", maxHeight: "90vh", margin: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-navy text-white shrink-0">
          <div>
            <h2 className="font-bold font-heading text-lg">Express Interest in This Lead</h2>
            <p className="text-xs text-teal-300 mt-0.5">Please read and sign both documents to proceed</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead summary */}
        <div className="px-6 py-3 bg-teal-light border-b border-teal/20 shrink-0">
          <p className="text-xs text-gray-600"><span className="font-semibold text-navy">Lead:</span> {leadSummary}</p>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-gray-100 shrink-0">
          {[
            { id: "referral" as const, label: "1. Referral Agreement", icon: <FileText className="w-4 h-4" />, done: referralRead },
            { id: "consent" as const, label: "2. Consent Form", icon: <Shield className="w-4 h-4" />, done: consentRead },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id ? "border-teal text-teal" : "border-transparent text-gray-500 hover:text-navy"
              }`}
            >
              {t.done ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Document content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "referral" && (
            <div>
              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                <h3 className="text-navy font-heading">APGP Referral Agreement</h3>
                <p>This Referral Agreement ("Agreement") is entered into between <strong>Ausnew Support Services Pty Ltd</strong> ("Ausnew") and the accommodation provider identified below ("Provider").</p>

                <h4>1. Purpose</h4>
                <p>By expressing interest in a participant lead through the APGP Provider Portal, the Provider agrees to the terms of this Referral Agreement. This Agreement governs the referral of NDIS participants to the Provider's accommodation properties.</p>

                <h4>2. Nature of the Referral</h4>
                <p>Ausnew will facilitate an introduction between the Provider and the participant (or their representative) for the purpose of assessing suitability for accommodation. The referral does not guarantee placement and is subject to participant consent and suitability assessment.</p>

                <h4>3. Provider Obligations</h4>
                <ul>
                  <li>The Provider will respond to referrals in a timely and professional manner.</li>
                  <li>The Provider will not contact the participant directly without Ausnew's facilitation.</li>
                  <li>The Provider will maintain the confidentiality of all participant information.</li>
                  <li>The Provider will comply with the NDIS Code of Conduct and all applicable legislation.</li>
                </ul>

                <h4>4. Fees</h4>
                <p>Fees applicable to this referral are governed by the Provider's existing partnership agreement with Ausnew. No fee is payable until a participant successfully completes intake and moves into the Provider's accommodation.</p>

                <h4>5. Confidentiality</h4>
                <p>All participant information shared by Ausnew is confidential and must be handled in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles. The Provider must not disclose participant information to any third party without Ausnew's written consent.</p>

                <h4>6. NDIS Compliance</h4>
                <p>All activities under this Agreement must comply with the NDIS Act 2013, the NDIS Practice Standards, and the NDIS Code of Conduct. No fee under this Agreement is charged to or recovered from any NDIS participant.</p>

                <h4>7. Governing Law</h4>
                <p>This Agreement is governed by the laws of New South Wales, Australia.</p>
              </div>
              {!referralRead && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">Please read the full agreement above before confirming.</p>
                </div>
              )}
              <Button
                onClick={() => { setReferralRead(true); setTab("consent"); }}
                className={`w-full ${referralRead ? "bg-green-600 hover:bg-green-700" : "bg-teal hover:bg-teal-600"} text-white`}
              >
                {referralRead ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Referral Agreement Accepted</> : "I Have Read and Accept the Referral Agreement"}
              </Button>
            </div>
          )}

          {tab === "consent" && (
            <div>
              <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                <h3 className="text-navy font-heading">APGP Provider Consent Form</h3>
                <p>By completing this form, the Provider consents to the following terms in relation to the participant lead they are expressing interest in.</p>

                <h4>1. Consent to Receive Referral</h4>
                <p>The Provider consents to receiving a referral from Ausnew Support Services for the purpose of assessing a participant's suitability for accommodation at one of the Provider's properties.</p>

                <h4>2. Consent to Data Handling</h4>
                <p>The Provider acknowledges that participant information will be shared by Ausnew for the sole purpose of facilitating this referral. The Provider consents to handling this information in accordance with the Privacy Act 1988 (Cth) and agrees not to use it for any purpose other than assessing accommodation suitability.</p>

                <h4>3. Consent to Contact</h4>
                <p>The Provider consents to being contacted by the Ausnew team to progress this referral. The Provider acknowledges that direct contact with the participant will only occur after Ausnew has facilitated the introduction.</p>

                <h4>4. Acknowledgement</h4>
                <p>The Provider acknowledges that:</p>
                <ul>
                  <li>Expressing interest does not guarantee a placement.</li>
                  <li>All placement fees are success-based and governed by the Provider's partnership agreement.</li>
                  <li>This consent is specific to the lead identified in this submission.</li>
                </ul>
              </div>
              {!consentRead && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">Please read the full consent form above before confirming.</p>
                </div>
              )}
              <Button
                onClick={() => setConsentRead(true)}
                className={`w-full mb-4 ${consentRead ? "bg-green-600 hover:bg-green-700" : "bg-teal hover:bg-teal-600"} text-white`}
              >
                {consentRead ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Consent Form Accepted</> : "I Have Read and Accept the Consent Form"}
              </Button>

              {/* Signatory details */}
              {consentRead && (
                <div className="space-y-4 border-t border-gray-100 pt-4">
                  <h4 className="font-bold text-navy font-heading">Signatory Details</h4>
                  <div>
                    <Label className="text-navy font-medium text-sm">Your Full Name *</Label>
                    <Input value={form.signatoryName} onChange={(e) => setForm({ ...form, signatoryName: e.target.value })} placeholder="Full legal name" className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-navy font-medium text-sm">Organisation Name *</Label>
                    <Input value={form.signatoryOrg} onChange={(e) => setForm({ ...form, signatoryOrg: e.target.value })} placeholder="Your organisation" className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-navy font-medium text-sm">Notes for Ausnew Team <span className="text-gray-400 font-normal">(optional)</span></Label>
                    <Textarea value={form.providerNotes} onChange={(e) => setForm({ ...form, providerNotes: e.target.value })} placeholder="e.g. We have a suitable 2-bedroom property in Parramatta available immediately..." rows={3} className="mt-1.5" maxLength={500} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-3 text-xs text-gray-500">
              <span className={`flex items-center gap-1 ${referralRead ? "text-green-600" : ""}`}>
                {referralRead ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                Referral Agreement
              </span>
              <span className={`flex items-center gap-1 ${consentRead ? "text-green-600" : ""}`}>
                {consentRead ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                Consent Form
              </span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || expressInterest.isPending}
              className="bg-teal hover:bg-teal-600 text-white disabled:opacity-50"
            >
              {expressInterest.isPending ? "Submitting..." : "Submit to Ausnew Team"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
