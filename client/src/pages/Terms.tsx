import PublicLayout from "@/components/PublicLayout";

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
          <p className="text-gray-400 text-sm mt-2">Effective: 2025 · Ausnew Support Services Pty Ltd</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container max-w-3xl">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">

            <p className="text-base font-medium text-navy border-l-4 border-teal pl-5 py-2 bg-teal-light rounded-r-xl mb-8">
              These Terms of Service constitute a binding Memorandum of Understanding between <strong>Ausnew Support Services Pty Ltd</strong> and participating accommodation providers.
            </p>

            {/* Section 1 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">1. Nature of the Arrangement</h2>
            <p>
              All partnership arrangements under the Accommodation Provider Growth Program (APGP) are strictly business-to-business. Fees relate solely to the commercial services provided by Ausnew Support Services to accommodation providers, including marketing, intake coordination, participant matching, vacancy support, and ongoing portfolio management.
            </p>
            <p>
              These arrangements do not involve participant billing and are entirely separate from NDIS funding processes. No fee under this agreement is charged to, or recovered from, any NDIS participant.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">2. Partnership Pathways</h2>
            <p>Providers may participate under one of two partnership models:</p>

            <h3 className="text-lg font-bold text-navy font-heading mt-6 mb-3">2.1 Joint Venture Partnership — Shared Supports Model</h3>
            <p>
              When Ausnew Support Services can deliver ongoing Community Access supports for the participant, the accommodation provider receives:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3 mb-4">
              <li>A fully managed intake process</li>
              <li>A participant matched to the provider's property</li>
              <li>Ongoing community access supports delivered by Ausnew</li>
              <li>In-home supports delivered by the provider's SIL team</li>
              <li>No placement fee under this model</li>
              <li>A collaborative long-term support model that strengthens participant stability</li>
            </ul>
            <p>
              Under this model, there is no placement fee payable by the provider. The collaboration centres on shared service delivery between two registered NDIS providers.
            </p>

            <h3 className="text-lg font-bold text-navy font-heading mt-6 mb-3">2.2 Referral Partnership — Success-Based Model</h3>
            <p>
              When Ausnew cannot deliver ongoing supports due to location or rostering feasibility, participants are referred through a success-based referral model. The provider pays only when the participant:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3 mb-4">
              <li>Completes intake; and</li>
              <li>Signs and moves into the provider's accommodation.</li>
            </ul>
            <p>The placement fee covers the following services delivered by Ausnew:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3 mb-4">
              <li>Marketing and lead generation</li>
              <li>Discovery and qualification calls</li>
              <li>Suitability assessment</li>
              <li>Documentation collection</li>
              <li>Property matching</li>
              <li>Inspection scheduling</li>
              <li>Intake handover</li>
            </ul>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">3. Pricing Structure</h2>

            <h3 className="text-lg font-bold text-navy font-heading mt-6 mb-3">3.1 Joint Venture Partnership</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-sm">
                <thead><tr className="bg-navy text-white"><th className="px-5 py-3 text-left font-semibold">Item</th><th className="px-5 py-3 text-left font-semibold">Structure</th><th className="px-5 py-3 text-left font-semibold">Key Benefit</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-white"><td className="px-5 py-4 font-medium text-navy">Placement Fee</td><td className="px-5 py-4 text-gray-600">None under this model</td><td className="px-5 py-4 text-gray-600">No placement fee when Ausnew provides ongoing community access supports.</td></tr>
                  <tr className="bg-gray-50"><td className="px-5 py-4 font-medium text-navy">Ausnew's Role</td><td className="px-5 py-4 text-gray-600">Community Access supports delivered directly to the participant</td><td className="px-5 py-4 text-gray-600">Strengthens participant engagement without increasing the provider's staffing load.</td></tr>
                  <tr className="bg-white"><td className="px-5 py-4 font-medium text-navy">Provider's Role</td><td className="px-5 py-4 text-gray-600">In-home support delivery (SIL/SIO)</td><td className="px-5 py-4 text-gray-600">Clear division of responsibilities while maintaining full control of in-home care.</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-bold text-navy font-heading mt-6 mb-3">3.2 Referral Partnership</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-sm">
                <thead><tr className="bg-teal text-white"><th className="px-5 py-3 text-left font-semibold">Item</th><th className="px-5 py-3 text-left font-semibold">Structure</th><th className="px-5 py-3 text-left font-semibold">Key Benefit</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-white"><td className="px-5 py-4 font-medium text-navy">Placement Fee (Success-Based)</td><td className="px-5 py-4 text-gray-600">Fixed fee per successful onboarding</td><td className="px-5 py-4 text-gray-600">No payment until participant completes intake and moves into accommodation.</td></tr>
                  <tr className="bg-gray-50"><td className="px-5 py-4 font-medium text-navy">Weekly Subscription (VPP)</td><td className="px-5 py-4 text-gray-600">Fixed weekly fee per placed participant (e.g. from $200/week while they remain in the property)</td><td className="px-5 py-4 text-gray-600">Ongoing vacancy protection; replacement search activated if participant exits.</td></tr>
                  <tr className="bg-white"><td className="px-5 py-4 font-medium text-navy">Replacement Search</td><td className="px-5 py-4 text-gray-600">Included in weekly subscription</td><td className="px-5 py-4 text-gray-600">Reduces downtime between participants and maintains stable occupancy.</td></tr>
                  <tr className="bg-gray-50"><td className="px-5 py-4 font-medium text-navy">CRM Vacancy Management</td><td className="px-5 py-4 text-gray-600">Included in weekly subscription</td><td className="px-5 py-4 text-gray-600">Property and vacancy data maintained and actively used for matching.</td></tr>
                  <tr className="bg-white"><td className="px-5 py-4 font-medium text-navy">Vacancy Visibility &amp; Matching</td><td className="px-5 py-4 text-gray-600">Included in weekly subscription</td><td className="px-5 py-4 text-gray-600">Properties remain visible to a steady flow of pre-qualified leads.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 italic">Final pricing will depend on region, participant needs, and provider portfolio.</p>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">4. Vacancy Protection Plan (VPP)</h2>
            <p>
              Once a participant is onboarded under the Referral Partnership, a weekly subscription (the Vacancy Protection Plan) may be activated. This subscription supports:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3 mb-4">
              <li>Priority search and replacement if the participant exits</li>
              <li>Ongoing visibility of the provider's vacancies</li>
              <li>Continuous intake activity and matching</li>
              <li>CRM maintenance of the provider's property portfolio</li>
            </ul>
            <p>The VPP is optional but strongly recommended for providers seeking consistent long-term occupancy.</p>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">5. Program Outcomes and Provider Obligations</h2>
            <p>Ausnew enables providers to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3 mb-4">
              <li>Maintain stable occupancy</li>
              <li>Reduce vacancy downtime</li>
              <li>Remove marketing and recruitment overhead</li>
              <li>Improve participant matching quality</li>
              <li>Focus on delivering exceptional in-home supports</li>
            </ul>
            <p>
              Providers agree to respond to referrals in a timely manner, maintain accurate vacancy information, and cooperate with Ausnew's intake coordination process.
            </p>

            {/* Section 6 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">6. NDIS Compliance and Ethical Standards</h2>
            <p>
              Both parties agree to conduct all activities in accordance with the NDIS Act 2013, the NDIS Code of Conduct, and the NDIS Practice Standards. No fee under this agreement is charged to, or recovered from, any NDIS participant.
            </p>
            <p>
              All partnership arrangements are strictly business-to-business. Fees relate solely to commercial services provided by Ausnew to accommodation providers. These arrangements are entirely separate from NDIS funding processes.
            </p>

            {/* Section 7 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">7. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential all participant information, business processes, pricing structures, and proprietary systems disclosed in connection with this agreement. Participant information must be handled in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.
            </p>

            {/* Section 8 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">8. Termination</h2>
            <p>
              Either party may terminate this arrangement with 30 days' written notice. Termination does not affect obligations arising from placements already completed or fees already incurred prior to the termination date.
            </p>

            {/* Section 9 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">9. Governing Law</h2>
            <p>
              This agreement is governed by the laws of New South Wales, Australia. Any disputes will be resolved through good-faith negotiation, and if unresolved, through mediation before any legal proceedings are commenced.
            </p>

            {/* Section 10 */}
            <h2 className="text-2xl font-bold text-navy font-heading mt-10 mb-4">10. Contact</h2>
            <p>For enquiries regarding these Terms of Service, contact:</p>
            <div className="bg-gray-50 rounded-xl p-5 mt-4 border border-gray-200">
              <p className="font-semibold text-navy">Ausnew Support Services Pty Ltd</p>
              <p className="text-gray-600 text-sm mt-1">Accommodation Provider Growth Program</p>
              <p className="text-gray-600 text-sm">Email: <a href="mailto:provider@APGPaccommodation.com.au" className="text-teal hover:underline">provider@APGPaccommodation.com.au</a></p>
              <p className="text-gray-600 text-sm">Phone: <a href="tel:+61296699302" className="text-teal hover:underline">(02) 9669 9302</a></p>
              <p className="text-gray-600 text-sm mt-2">Website: <a href="https://ausnewdisability.com" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">ausnewdisability.com</a></p>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200 text-xs text-gray-400">
              <p>© {new Date().getFullYear()} Accommodation Provider Growth Program. A program by Ausnew Support Services Pty Ltd. All rights reserved.</p>
              <p className="mt-1">These terms were last updated in 2025. Ausnew reserves the right to update these terms with reasonable notice to participating providers.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
