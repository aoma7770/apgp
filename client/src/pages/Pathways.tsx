import { CheckCircle2 } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pathways() {
  return (
    <PublicLayout>
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Partnership Pathways</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">Two Pathways — One Reliable Outcome</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            A predictable stream of participants professionally screened, intake-ready, and matched to your properties. Choose the pathway that fits your organisation's structure.
          </p>
        </div>
      </section>

      {/* JV Partnership */}
      <section id="jv" className="py-16 lg:py-24 bg-white scroll-mt-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-block bg-navy text-teal-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Pathway 1</div>
              <h2 className="text-3xl font-bold text-navy font-heading mb-3">Joint Venture Partnership</h2>
              <p className="text-teal font-semibold mb-6">Shared Supports Model</p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                When Ausnew Support Services can deliver ongoing Community Access supports for the participant, your organisation receives a fully managed intake process with no placement fee. This model is built on shared service delivery between two providers.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                This partnership is highly effective for participants with moderate to high support needs requiring regular community access. Ausnew handles the community access component while your SIL team delivers in-home supports — a clear, collaborative division of responsibilities.
              </p>
              <h3 className="font-bold text-navy font-heading mb-4">What Your Organisation Receives</h3>
              <ul className="space-y-3 mb-8">
                {["A fully managed intake process", "A participant matched to your property", "Ongoing community access supports delivered by Ausnew", "In-home supports delivered by your SIL team", "No placement fee under this model", "A collaborative long-term support model that strengthens participant stability"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-teal mt-0.5 shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <Link href="/provider/register">
  <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
    Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
  </Button>
</Link>
            </div>
            <div className="bg-gray-50 rounded-3xl p-8 lg:p-10">
              <h3 className="font-bold text-navy font-heading text-lg mb-6">Roles and Responsibilities</h3>
              <div className="space-y-6">
                <div className="bg-navy rounded-2xl p-6 text-white">
                  <div className="text-teal-300 text-xs font-semibold uppercase tracking-widest mb-2">Ausnew's Role</div>
                  <p className="text-sm text-gray-200 leading-relaxed">Community Access supports delivered directly to the participant. Strengthens participant engagement and outcomes without increasing the provider's internal staffing load.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="text-teal text-xs font-semibold uppercase tracking-widest mb-2">Provider's Role</div>
                  <p className="text-sm text-gray-600 leading-relaxed">In-home support delivery (SIL/SIO). Clear division of responsibilities while maintaining full control of in-home care and day-to-day operations.</p>
                </div>
                <div className="bg-teal-light rounded-2xl p-6">
                  <div className="text-navy text-xs font-semibold uppercase tracking-widest mb-2">Placement Fee</div>
                  <p className="text-sm text-gray-700 font-semibold">None under this model</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">No placement fee applies when Ausnew delivers ongoing community access supports, as the collaboration centres on shared service delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Partnership */}
      <section id="referral" className="py-16 lg:py-24 bg-gray-50 scroll-mt-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="order-2 lg:order-1 bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-navy font-heading text-lg mb-6">Pricing Structure</h3>
              <div className="space-y-5">
                {[
                  { label: "Placement Fee (Success-Based)", value: "Quoted per lead — tailored to your region", note: "No payment until the participant completes intake and moves into your accommodation. A quote is issued for each successful placement." },
                  { label: "Lead Generation", value: "Included — no additional cost", note: "Ausnew sources and qualifies participants from its pipeline at no extra charge." },
                  { label: "Intake Coordination", value: "Included — no additional cost", note: "Documentation, assessments, inspections, and onboarding all managed by Ausnew." },
                  { label: "Move-In Support", value: "Included — no additional cost", note: "Ausnew stays engaged through the transition to ensure a stable start." },
                ].map((row) => (
                  <div key={row.label} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <span className="text-sm font-semibold text-navy">{row.label}</span>
                      <span className="text-sm text-teal font-medium text-right">{row.value}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{row.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-6 italic">Pricing is per lead and per result — a tailored quote is issued for each successful placement.</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-teal text-white text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Pathway 2</div>
              <h2 className="text-3xl font-bold text-navy font-heading mb-3">Referral Partnership</h2>
              <p className="text-teal font-semibold mb-6">Success-Based Placement Fee — Quoted Per Lead</p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                When Ausnew cannot deliver ongoing supports due to location or rostering feasibility, participants are referred through our success-based referral model. You pay only when a participant successfully moves in.
              </p>
              <h3 className="font-bold text-navy font-heading mb-4">What the Placement Fee Covers</h3>
              <ul className="space-y-3 mb-8">
                {["Marketing and lead generation", "Discovery and qualification calls", "Suitability assessment", "Documentation collection", "Property matching", "Inspection scheduling", "Intake handover"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-teal mt-0.5 shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <h3 className="font-bold text-navy font-heading mb-4">Ongoing Support After Placement</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Once the participant is onboarded, Ausnew continues to support the relationship — assisting with vacancy management, ongoing matching, and participant retention to help you maintain stable long-term occupancy.
              </p>
              <Link href="/provider/register">
  <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
    Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
  </Button>
</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-3xl font-bold font-heading mb-4">Choose Your Partnership Pathway</h2>
          <p className="text-gray-300 mb-8">Register for free and our team will discuss which pathway best fits your organisation's structure and goals.</p>
          <Link href="/provider/register">
  <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
    Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
  </Button>
</Link>
        </div>
      </section>
    </PublicLayout>
  );
}