import PublicLayout from "@/components/PublicLayout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <PublicLayout>
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Pricing Structure</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">Transparent, Success-Based Pricing</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            APGP operates on a <strong className="text-teal-300">per-result, per-lead basis</strong>. No upfront fees, no retainers. A tailored quote is prepared for each successful placement based on your region, participant profile, and portfolio. Register free to receive a personalised proposal.
          </p>
        </div>
      </section>

      {/* JV Pricing */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-navy font-heading mb-8 text-center">Joint Venture Partnership</h2>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-6 py-4 text-left font-semibold">Item</th>
                  <th className="px-6 py-4 text-left font-semibold">Structure</th>
                  <th className="px-6 py-4 text-left font-semibold">Key Benefit to Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 font-medium text-navy">Placement Fee</td>
                  <td className="px-6 py-5 text-gray-600">None under this model</td>
                  <td className="px-6 py-5 text-gray-600">No placement fee when Ausnew provides ongoing community access supports.</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 font-medium text-navy">Ausnew's Role</td>
                  <td className="px-6 py-5 text-gray-600">Community Access supports delivered directly</td>
                  <td className="px-6 py-5 text-gray-600">Strengthens participant engagement without increasing the provider's staffing load.</td>
                </tr>
                <tr className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 font-medium text-navy">Provider's Role</td>
                  <td className="px-6 py-5 text-gray-600">In-home support delivery (SIL/SIO)</td>
                  <td className="px-6 py-5 text-gray-600">Clear division of responsibilities while maintaining full control of in-home care.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Referral Pricing */}
      <section className="py-8 pb-16 lg:pb-24 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-navy font-heading mb-8 text-center">Referral Partnership Model</h2>
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-teal text-white">
                  <th className="px-6 py-4 text-left font-semibold">Item</th>
                  <th className="px-6 py-4 text-left font-semibold">Structure</th>
                  <th className="px-6 py-4 text-left font-semibold">Key Benefit to Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { item: "Placement Fee (Success-Based)", structure: "Quoted per lead — tailored to region and participant profile", benefit: "No payment until participant completes intake and moves into your accommodation. A quote is issued for each placement." },
                  { item: "Lead Generation", structure: "Included — no additional cost", benefit: "Ausnew sources and qualifies participants from its pipeline at no extra charge to the provider." },
                  { item: "Intake Coordination", structure: "Included — no additional cost", benefit: "Documentation, assessments, inspections, and onboarding are all managed by Ausnew." },
                  { item: "Move-In Support", structure: "Included — no additional cost", benefit: "Ausnew stays engaged through the transition to ensure a stable start for the participant." },
                ].map((row) => (
                  <tr key={row.item} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-medium text-navy">{row.item}</td>
                    <td className="px-6 py-5 text-gray-600">{row.structure}</td>
                    <td className="px-6 py-5 text-gray-600">{row.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center italic">
            Pricing is per lead and per result — a tailored quote is issued for each successful placement based on your region, participant needs, and portfolio. No upfront fees apply. Contact Ausnew for a personalised proposal.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-3xl font-bold font-heading mb-4">Get a Tailored Proposal</h2>
          <p className="text-gray-300 mb-8">Register your organisation and our team will contact you to discuss pricing specific to your region and portfolio.</p>
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