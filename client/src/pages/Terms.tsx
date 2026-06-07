import PublicLayout from "@/components/PublicLayout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-14 lg:py-20">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Legal</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-4">Terms of Service</h1>
          <p className="text-gray-300 text-base">
            Accommodation Provider Growth Program (APGP) — Memorandum of Understanding
          </p>
          <p className="text-gray-400 text-sm mt-2">Ausnew Support Services Pty Ltd</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container max-w-3xl">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">

            <p className="text-base font-medium text-navy border-l-4 border-teal pl-5 py-2 bg-teal-light rounded-r-xl mb-8">
              These Terms of Service constitute a binding Memorandum of Understanding between <strong>Ausnew Support Services Pty Ltd</strong> and participating accommodation providers.
            </p>

            {/* Nature of Arrangement */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">1. Nature of the Arrangement</h2>
            <p>
              All partnership arrangements under the Accommodation Provider Growth Program (APGP) are strictly business-to-business. Fees relate solely to the commercial services provided by Ausnew Support Services to accommodation providers, such as marketing, intake coordination, participant matching, vacancy support, and ongoing portfolio management.
            </p>
            <p>
              These arrangements do not involve participant billing and are entirely separate from NDIS funding processes.
            </p>

            {/* Partnership Pathways */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">2. Partnership Pathways</h2>

            <h3 className="text-xl font-bold text-navy font-heading mt-6 mb-3">2.1 Shared Supports Model (Joint Venture Partnership)</h3>
            <p>When Ausnew Support Services can deliver ongoing Community Access supports for the participant, your organisation receives:</p>
            <ul>
              <li>A fully managed intake process</li>
              <li>A participant matched to your property</li>
              <li>Ongoing community access supports delivered by Ausnew</li>
              <li>In-home supports delivered by your SIL team</li>
              <li>No placement fee</li>
              <li>A collaborative long-term support model that strengthens participant stability</li>
            </ul>
            <p>This partnership is highly effective for participants with moderate–high support needs requiring regular community access.</p>

            <h3 className="text-xl font-bold text-navy font-heading mt-6 mb-3">2.2 Success-Based Placement Fee + Weekly Subscription (Referral Partnership)</h3>
            <p>When Ausnew cannot deliver ongoing supports due to location or rostering feasibility, participants are referred through our success-based referral model.</p>

            <h4 className="font-bold text-navy mt-4 mb-2">Placement Fee (Success-Based)</h4>
            <p>Pay only when the participant: completes intake; and signs and moves into your accommodation.</p>
            <p>The placement fee covers:</p>
            <ul>
              <li>Marketing and lead generation</li>
              <li>Discovery and qualification calls</li>
              <li>Suitability assessment</li>
              <li>Documentation collection</li>
              <li>Property matching</li>
              <li>Inspection scheduling</li>
              <li>Intake handover</li>
            </ul>

            <h4 className="font-bold text-navy mt-4 mb-2">Weekly Subscription Fee (Success-Based, Activated Once Participant Moves In)</h4>
            <p>Once the participant is onboarded, a small weekly subscription begins, supporting:</p>
            <ul>
              <li>Priority search and replacement if the participant exits</li>
              <li>Ongoing visibility of your vacancies</li>
              <li>Continuous intake activity and matching</li>
              <li>CRM maintenance of your property portfolio</li>
            </ul>
            <p>This model ensures long-term vacancy protection and reliable intake continuity.</p>

            {/* Pricing Structure */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">3. Pricing Structure</h2>
            <p>Below is a proposed pricing structure for both partnership pathways. Final pricing will depend on region, participant needs, and provider portfolio.</p>

            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-left p-3 font-semibold">Item</th>
                    <th className="text-left p-3 font-semibold">Joint Venture</th>
                    <th className="text-left p-3 font-semibold">Referral</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      item: "Placement Fee",
                      jv: "None — no placement fee under this model when Ausnew delivers community access supports",
                      referral: "Fixed fee per successful onboarding. No payment until participant completes intake and moves in.",
                    },
                    {
                      item: "Ausnew's Role",
                      jv: "Community Access supports delivered directly to the participant",
                      referral: "Marketing, intake coordination, matching, and handover",
                    },
                    {
                      item: "Provider's Role",
                      jv: "In-home support delivery (SIL/SIO)",
                      referral: "Accommodation and in-home supports",
                    },
                    {
                      item: "Weekly Subscription",
                      jv: "N/A",
                      referral: "Fixed weekly fee per placed participant (e.g. from $200/week while they remain in the property)",
                    },
                    {
                      item: "Replacement Search",
                      jv: "N/A",
                      referral: "Included as part of the weekly subscription",
                    },
                    {
                      item: "CRM Vacancy Management",
                      jv: "N/A",
                      referral: "Included as part of the weekly subscription",
                    },
                    {
                      item: "Vacancy Visibility & Matching",
                      jv: "Included",
                      referral: "Included as part of the weekly subscription",
                    },
                  ].map((row, i) => (
                    <tr key={row.item} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 font-semibold text-navy border-b border-gray-100">{row.item}</td>
                      <td className="p-3 text-gray-600 border-b border-gray-100">{row.jv}</td>
                      <td className="p-3 text-gray-600 border-b border-gray-100">{row.referral}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* What Ausnew Enables */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">4. What Ausnew Enables for Providers</h2>
            <p>Ausnew enables providers to:</p>
            <ul>
              <li>Maintain stable occupancy</li>
              <li>Reduce vacancy downtime</li>
              <li>Remove marketing and recruitment overhead</li>
              <li>Improve participant matching quality</li>
              <li>Focus on delivering exceptional in-home supports</li>
            </ul>

            {/* NDIS Compliance */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">5. NDIS Compliance and Participant Safeguards</h2>
            <p>
              All partnership arrangements under the Accommodation Provider Growth Program are strictly business-to-business. Fees relate solely to the commercial services provided by Ausnew Support Services to accommodation providers, such as marketing, intake coordination, participant matching, vacancy support, and ongoing portfolio management.
            </p>
            <p>
              These arrangements do not involve participant billing and are entirely separate from NDIS funding processes.
            </p>
            <p>The Provider acknowledges that:</p>
            <ul>
              <li>All Participants retain full choice and control</li>
              <li>No fees are charged to Participants, their families, or their NDIS plans</li>
              <li>The APGP is a business-to-business commercial arrangement</li>
            </ul>
            <p>Each party must comply with all applicable laws, including the <strong>NDIS Act</strong>, <strong>NDIS Code of Conduct</strong>, and <strong>Australian Consumer Law</strong>.</p>

            {/* Confidentiality */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">6. Confidentiality</h2>
            <p>
              All participant information shared by Ausnew is confidential and must be handled in accordance with the <strong>Privacy Act 1988 (Cth)</strong> and the Australian Privacy Principles. The Provider must not disclose participant information to any third party without Ausnew's written consent.
            </p>

            {/* Term and Termination */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">7. Term and Termination</h2>
            <p>
              This Agreement commences on the date of execution and continues until terminated by either party on <strong>thirty (30) days' written notice</strong>, subject to accrued rights and obligations.
            </p>
            <p>Termination does not affect:</p>
            <ul>
              <li>Fees already incurred or payable; or</li>
              <li>Obligations that survive termination under these Terms of Service.</li>
            </ul>

            {/* Governing Law */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">8. Governing Law</h2>
            <p>
              This Agreement is governed by the laws of <strong>New South Wales</strong>, Australia, and the parties submit to the non-exclusive jurisdiction of the courts of that State.
            </p>

            {/* Expression of Interest */}
            <div className="mt-12 bg-teal-light rounded-2xl p-8 text-center border border-teal/20">
              <h3 className="text-xl font-bold text-navy font-heading mb-3">Join the Accommodation Provider Growth Program</h3>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                To join the Accommodation Provider Growth Program or request a tailored proposal, register your organisation for free. Tell us about your vacancies, properties, and regions serviced, and our team will contact you to discuss your placement requirements.
              </p>
              <Link href="/provider/register">
                <Button className="bg-teal hover:bg-teal-600 text-white font-semibold px-8">
                  Register Free — No Cost <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
