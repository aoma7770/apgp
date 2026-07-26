import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function Clause({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors group"
      >
        <span className="font-bold text-navy font-heading text-base">
          <span className="text-teal mr-2">{number}.</span>
          {title}
        </span>
        <span className={`ml-4 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${open ? "bg-teal border-teal text-white" : "border-gray-300 text-gray-400 group-hover:border-teal group-hover:text-teal"}`}>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm text-gray-700 leading-relaxed space-y-3 border-t border-gray-100 pt-4 bg-gray-50/50">
          {children}
        </div>
      )}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-relaxed">{children}</p>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className="font-semibold text-navy mb-1.5">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Table({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 mt-2">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-navy text-white">
            <th className="px-4 py-3 text-left font-semibold">Fee Item</th>
            <th className="px-4 py-3 text-left font-semibold">Amount (excl. GST)</th>
            <th className="px-4 py-3 text-left font-semibold">Trigger / Condition</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(([item, amount, trigger], i) => (
            <tr key={i} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-navy">{item}</td>
              <td className="px-4 py-3 text-gray-700">{amount}</td>
              <td className="px-4 py-3 text-gray-600">{trigger}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Terms() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Legal</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">Terms of Service</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Memorandum of Understanding — Referral Partnership Model
          </p>
          <p className="text-gray-400 text-sm mt-3">
            Silara Marketing (ACN 688042177) | apgpaccommodation.com.au
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 bg-teal-light border-b border-teal/20">
        <div className="container max-w-4xl">
          <p className="text-gray-700 text-sm leading-relaxed text-center">
            These Terms of Service constitute a binding Memorandum of Understanding between the Accommodation Provider Growth Program (APGP) and participating accommodation providers. Click any clause below to expand and read the full text.
          </p>
        </div>
      </section>

      {/* Clauses */}
      <section className="py-12 bg-white">
        <div className="container max-w-4xl">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

            <Clause number="1" title="Parties">
              <Sub title="1.1 Accommodation Provider Growth Program (APGP)">
                <P>This Memorandum of Understanding ("MOU") is entered into by Silara Marketing (ACN 688042177) ("APGP"). APGP is an independent accommodation referral and marketing platform operating within the Australian NDIS ecosystem. APGP provides business-to-business referral services connecting registered disability accommodation providers with participants seeking SDA, SIL, STA, MTA, or similar accommodation arrangements. APGP operates exclusively as a referral and placement facilitation platform and does not provide NDIS supports, care services, or accommodation directly to participants.</P>
              </Sub>
              <Sub title="1.2 Accommodation Provider">
                <P>The other party to this MOU is the entity identified in the execution page of this document ("Accommodation Provider"). The Accommodation Provider is an organisation that owns, manages, leases, or otherwise operates disability accommodation — including but not limited to SDA, SIL, STA, MTA, or similar accommodation arrangements — and agrees to participate in the APGP in accordance with the terms of this MOU.</P>
              </Sub>
              <Sub title="1.3 Background and Purpose">
                <P>APGP has developed its referral platform to facilitate introductions between accommodation providers and suitable NDIS participants, with the objective of reducing vacancy periods and supporting sustainable occupancy outcomes for providers. The Accommodation Provider wishes to participate in the APGP and receive referrals of potential participants, subject to the terms and conditions set out in this MOU.</P>
                <P>This MOU sets out the commercial framework, roles and responsibilities, and fee arrangements governing the relationship between APGP and the Accommodation Provider under the referral partnership. Nothing in this MOU creates a partnership, agency, employment, or joint venture relationship between the parties, or limits the Accommodation Provider's obligations to comply with all applicable laws, including the NDIS Act, NDIS Practice Standards, and the Australian Consumer Law.</P>
              </Sub>
            </Clause>

            <Clause number="2" title="Definitions and Interpretation">
              <Sub title="2.1 Definitions">
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-gray-100">
                      {[
                        ["APGP", "Silara Marketing (ACN 688042177), being an independent referral and marketing platform for disability accommodation providers."],
                        ["Accommodation Provider", "The entity identified in clause 1.2 that participates in the APGP referral program."],
                        ["Business Day", "A day other than a Saturday, Sunday, or public holiday in New South Wales."],
                        ["Commencement Date", "The date on which this MOU is executed by both parties."],
                        ["Confidential Information", "All non-public information disclosed by one party to the other in connection with this MOU, including participant information, commercial terms, pricing, referral data, and business strategies."],
                        ["GST", "Has the meaning given in the A New Tax System (Goods and Services Tax) Act 1999 (Cth)."],
                        ["MOU", "This Memorandum of Understanding, including all schedules and amendments."],
                        ["Participant", "A person with disability introduced or referred to the Accommodation Provider through the APGP platform."],
                        ["Placement", "The successful introduction of a Participant to the Accommodation Provider resulting in the Participant entering into an accommodation arrangement."],
                        ["Placement Fee", "The one-off, success-based fee payable by the Accommodation Provider to APGP upon a successful Placement, as set out in Schedule 2."],
                        ["Vacancy Protection Retainer (VPR)", "The optional ongoing weekly fee payable by the Accommodation Provider for vacancy replacement support and priority referral access, as set out in Schedule 2."],
                      ].map(([term, def], i) => (
                        <tr key={i} className="bg-white hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-navy w-1/3 align-top">{term}</td>
                          <td className="px-4 py-3 text-gray-700">{def}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Sub>
              <Sub title="2.2 Interpretation">
                <P>In this MOU: headings are for convenience only; words in the singular include the plural and vice versa; references to legislation include all amendments and subordinate legislation; "including" is not a word of limitation; and an obligation not to do something includes not permitting that thing to be done.</P>
              </Sub>
              <Sub title="2.3 Priority of Documents">
                <P>In the event of inconsistency: this MOU prevails over any schedule or annexure; Schedule 1 (Partnership Model Election) prevails over Schedule 2 (Fee Schedule); and Schedule 2 prevails over any other schedule.</P>
              </Sub>
            </Clause>

            <Clause number="3" title="Nature of the Relationship">
              <Sub title="3.1 Independent Contracting Parties">
                <P>The parties enter into this MOU as independent contracting parties. Nothing in this MOU creates, or is intended to create, any relationship of partnership, joint venture, agency, employment, or fiduciary nature between the parties.</P>
              </Sub>
              <Sub title="3.2 No Authority to Bind">
                <P>Neither party may make representations, warranties, or commitments on behalf of the other; enter into agreements purporting to bind the other; or hold itself out as having authority to act for the other, unless expressly authorised in writing.</P>
              </Sub>
              <Sub title="3.3 Independent Compliance Obligations">
                <P>Each party is solely responsible for ensuring its own compliance with all applicable laws, regulations, and standards, including the National Disability Insurance Scheme Act 2013 (Cth), the NDIS Practice Standards, the NDIS Code of Conduct, and the Australian Consumer Law.</P>
              </Sub>
            </Clause>

            <Clause number="4" title="Program Overview">
              <Sub title="4.1 Overview of APGP">
                <P>The Accommodation Provider Growth Program (APGP) is an independent business-to-business referral and marketing platform. Under the APGP, the platform identifies and introduces suitable participants to accommodation providers with the objective of facilitating placement outcomes and supporting reduced vacancy periods.</P>
              </Sub>
              <Sub title="4.2 Program Objectives">
                <UL items={[
                  "Assist accommodation providers to improve occupancy outcomes through access to suitable participant referrals.",
                  "Reduce vacancy periods and associated commercial risk.",
                  "Streamline referral, placement, and engagement processes.",
                  "Establish a commercial referral relationship between APGP and the Accommodation Provider.",
                ]} />
              </Sub>
              <Sub title="4.3 Non-Exclusive Participation">
                <P>Participation in the APGP is non-exclusive. The Accommodation Provider remains free to receive referrals from, and engage with, other referral sources, support coordinators, or third parties. APGP is not required to refer participants exclusively to the Accommodation Provider.</P>
              </Sub>
              <Sub title="4.4 No Guarantee of Referrals or Placements">
                <UL items={[
                  "APGP does not guarantee the number, frequency, or suitability of referrals provided.",
                  "Any referral or introduction does not guarantee a Placement.",
                  "All placement decisions remain subject to the Participant's independent choice and the Accommodation Provider's own assessment processes.",
                ]} />
              </Sub>
              <Sub title="4.5 Participant Choice and Provider Discretion">
                <UL items={[
                  "All participants retain full choice and control in relation to their accommodation decisions.",
                  "The Accommodation Provider retains sole discretion as to whether to accept or decline any referred Participant.",
                  "APGP does not direct, compel, or influence a Participant to enter into any accommodation arrangement.",
                ]} />
              </Sub>
            </Clause>

            <Clause number="5" title="Participant Safeguards and NDIS Compliance">
              <Sub title="5.1 Participant Choice and Control">
                <P>All Participants retain full choice and control in relation to accommodation, support providers, and services. Participation in the APGP does not restrict or influence a Participant's right to choose or change accommodation providers or support arrangements. No Participant is required, encouraged, or induced to enter into an accommodation arrangement as a result of this MOU.</P>
              </Sub>
              <Sub title="5.2 No Fees Charged to Participants">
                <UL items={[
                  "All fees payable under this MOU are payable solely by the Accommodation Provider.",
                  "No fees are charged to Participants, their families, nominees, guardians, or representatives.",
                  "No fees under this MOU are deducted from, invoiced to, or claimed against a Participant's NDIS plan.",
                ]} />
              </Sub>
              <Sub title="5.3 No Claims Against the NDIS">
                <UL items={[
                  "Fees payable under this MOU are commercial business-to-business fees.",
                  "Such fees do not constitute NDIS supports or services.",
                  "No claim will be made to the National Disability Insurance Agency (NDIA), a plan manager, or the NDIS for any amounts payable under this MOU.",
                ]} />
              </Sub>
              <Sub title="5.4 Conflict of Interest Management">
                <P>The parties must manage and disclose any actual, potential, or perceived conflicts of interest arising in connection with referrals under the APGP. APGP must not influence a Participant's accommodation decision for commercial benefit. The Accommodation Provider must not require or pressure a Participant to engage particular supports, services, or providers as a condition of accommodation.</P>
              </Sub>
              <Sub title="5.5 Compliance with the NDIS Code of Conduct">
                <P>Each party warrants that it will comply with the NDIS Code of Conduct, including obligations to act with respect for individual rights to freedom of expression, self-determination, and decision-making; provide supports and services in a safe, competent, and ethical manner; prevent and respond to abuse, neglect, and exploitation; and take all reasonable steps to prevent violence, misconduct, or restrictive practices.</P>
              </Sub>
              <Sub title="5.6 Transparency and Disclosure">
                <P>The Accommodation Provider acknowledges that Participants may be informed, in general terms, that APGP receives commercial fees from accommodation providers for referral and placement facilitation services. Any such disclosure must be accurate, not misleading, and must not imply coercion or preferential treatment.</P>
              </Sub>
              <Sub title="5.7 No Improper Inducements">
                <P>The parties agree that no payment, benefit, or incentive under this MOU is intended to improperly influence a Participant's decision-making. Fees under this MOU are payable solely in consideration of referral and placement facilitation services provided to the Accommodation Provider. Nothing in this MOU constitutes an inducement, kickback, or prohibited benefit under the NDIS regulatory framework.</P>
              </Sub>
            </Clause>

            <Clause number="6" title="Referral Partnership Model">
              <Sub title="6.1 Scope of Referral Services">
                <P>Under this MOU, APGP agrees to provide the Accommodation Provider with referral and placement facilitation services, which may include:</P>
                <UL items={[
                  "Identifying and introducing suitable Participants based on available information regarding participant needs and accommodation suitability.",
                  "Facilitating initial introductions between the Accommodation Provider and prospective Participants.",
                  "Supporting communication and coordination during the placement process.",
                ]} />
                <P>For the avoidance of doubt, APGP does not provide ongoing accommodation services, care services, support coordination, or NDIS supports to Participants under this MOU.</P>
              </Sub>
              <Sub title="6.2 Referral Process">
                <P>APGP may, from time to time, refer Participants to the Accommodation Provider. Each referral is provided on a non-exclusive basis and does not guarantee a Placement. The Accommodation Provider retains sole discretion to accept or decline any referred Participant.</P>
              </Sub>
              <Sub title="6.3 Accommodation Provider Obligations">
                <P>The Accommodation Provider must:</P>
                <UL items={[
                  "Independently assess the suitability of any referred Participant.",
                  "Communicate directly with the Participant regarding accommodation arrangements.",
                  "Ensure that any accommodation offered complies with all applicable legal and regulatory requirements.",
                  "Make all final decisions regarding acceptance, terms, and conditions of accommodation.",
                  "Maintain all required NDIS registrations and comply with all NDIS Practice Standards applicable to its accommodation services.",
                ]} />
              </Sub>
              <Sub title="6.4 APGP Obligations">
                <P>APGP must:</P>
                <UL items={[
                  "Act in good faith when identifying and referring Participants.",
                  "Provide accurate information to the extent reasonably available.",
                  "Not misrepresent the Participant, the Accommodation Provider, or the nature of any referral.",
                  "Comply with all applicable privacy laws in handling Participant information.",
                ]} />
              </Sub>
              <Sub title="6.5 No Ongoing Service Delivery">
                <P>APGP does not provide ongoing services, supports, or accommodation management to Participants following a Placement. The Accommodation Provider is solely responsible for all accommodation arrangements, services, and obligations relating to the Participant after Placement.</P>
              </Sub>
              <Sub title="6.6 Referral Acknowledgement">
                <P>A referral will be deemed to have occurred where APGP introduces a Participant to the Accommodation Provider and that introduction materially contributes to a Placement. The Accommodation Provider acknowledges that fees payable under this MOU are consideration solely for referral and placement facilitation services provided by APGP.</P>
              </Sub>
              <Sub title="6.7 No Obligation to Proceed">
                <P>Nothing in this MOU obliges the Accommodation Provider to enter into an accommodation arrangement with any referred Participant. Nothing in this MOU obliges APGP to continue referring Participants to the Accommodation Provider.</P>
              </Sub>
            </Clause>

            <Clause number="7" title="Fees and Commercial Terms">
              <Sub title="7.1 Placement Fee">
                <P>The Accommodation Provider agrees to pay APGP a one-off, success-based Placement Fee in respect of each successful Placement. The Placement Fee is calculated as two per cent (2%) of the Participant's annual NDIS funding allocation, subject to the following thresholds:</P>
                <Table rows={[
                  ["Placement Fee (standard)", "2% of annual NDIS funding allocation", "Successful Placement (move-in or execution of accommodation agreement, whichever is earlier)"],
                  ["Minimum Placement Fee", "$3,000 + GST", "Floor — applies where 2% calculation falls below this amount"],
                  ["Maximum Placement Fee", "$12,000 + GST", "Cap — applies where 2% calculation exceeds this amount"],
                  ["Placement Fee (VPR active — new vacancy)", "1% of annual NDIS funding allocation", "Accommodation Provider holds an active Vacancy Protection Retainer at time of new referral"],
                ]} />
                <P>The Placement Fee is a commercial business-to-business fee and is not charged to, deducted from, or claimed against a Participant's NDIS plan.</P>
              </Sub>
              <Sub title="7.2 Payment Arrangements for Placement Fee">
                <P>Unless otherwise agreed in writing, the Placement Fee is payable in full upon invoicing. By agreement, APGP may permit the Placement Fee to be paid by instalments, provided the Placement Fee is paid in full within sixty (60) days of the Placement trigger event.</P>
              </Sub>
              <Sub title="7.3 Vacancy Protection Retainer (VPR)">
                <P>The Accommodation Provider may elect to pay an optional Vacancy Protection Retainer in the amount of <strong>$150 per week plus GST</strong>. The VPR is payable in consideration of ongoing vacancy replacement support, priority referral access, and placement continuity services provided by APGP.</P>
                <P>The VPR commences on the date the Participant moves into the accommodation; applies only while the Participant remains in residence; and ceases automatically when the Participant exits. The VPR applies at the provider level and covers all properties operated by the Accommodation Provider while the VPR is active.</P>
              </Sub>
              <Sub title="7.4 Benefits of the Vacancy Protection Retainer">
                <UL items={[
                  <><strong>Replacement Without Additional Placement Fee:</strong> If a Participant exits, APGP will prioritise sourcing a suitable replacement Participant and no additional Placement Fee will be payable for that replacement Placement.</>,
                  <><strong>Priority Referral Access:</strong> The Accommodation Provider will receive priority access to suitable new Participant referrals ahead of non-subscribed providers.</>,
                  <><strong>Reduced Placement Fee for New Vacancies:</strong> For new vacancies not arising from a replacement, the Placement Fee is reduced to one per cent (1%) of the Participant's annual NDIS funding allocation while the VPR remains active.</>,
                ]} />
              </Sub>
              <Sub title="7.5 Opt-Out of Vacancy Protection Retainer">
                <P>Where the Accommodation Provider does not elect, or ceases, the VPR: APGP has no obligation to provide vacancy replacement support; the Accommodation Provider will not receive priority referral access; and all future placements will be subject to the standard Placement Fee under clause 7.1.</P>
              </Sub>
              <Sub title="7.6 GST">
                <P>All fees payable under this MOU are exclusive of GST unless expressly stated otherwise. GST is payable in addition to the relevant fee in accordance with the A New Tax System (Goods and Services Tax) Act 1999 (Cth).</P>
              </Sub>
              <Sub title="7.7 Invoicing and Payment Terms">
                <P>APGP will issue tax invoices for all fees payable under this MOU. Unless otherwise agreed: Placement Fees are invoiced upon the trigger event set out in clause 7.1; and VPR fees may be invoiced monthly in arrears. Payment terms are <strong>seven (7) days from invoice date</strong> unless otherwise specified in Schedule 2.</P>
              </Sub>
              <Sub title="7.8 Late Payment Administration Fee">
                <P>Any amount not paid by the due date will be deemed overdue. In respect of any overdue amount, APGP may charge a late payment administration fee of <strong>$50 plus GST per overdue invoice</strong>, representing a genuine pre-estimate of the reasonable administrative costs incurred in managing late payments. APGP may suspend the provision of further referrals or vacancy replacement support until all overdue amounts are paid in full.</P>
              </Sub>
              <Sub title="7.9 Debt Recovery">
                <P>If any undisputed amount remains unpaid for more than thirty (30) days after the due date, APGP may take reasonable steps to recover the outstanding amount, including referring the matter to an external debt collection agency or commencing legal proceedings. The Accommodation Provider agrees to indemnify APGP for all reasonable costs incurred in connection with debt recovery. APGP will not engage in any debt recovery action involving a Participant or a Participant's NDIS funding.</P>
              </Sub>
              <Sub title="7.10 Survival of Payment Obligations">
                <P>The Accommodation Provider's obligation to pay all outstanding fees, late payment administration fees, and recovery costs survives termination or expiry of this MOU.</P>
              </Sub>
            </Clause>

            <Clause number="8" title="Vacancy Replacement Support">
              <Sub title="8.1 Eligibility">
                <P>Vacancy replacement support is available only to Accommodation Providers that maintain an active VPR at the time a Participant exits. Where the VPR is not active at the time of exit, APGP has no obligation to provide replacement support.</P>
              </Sub>
              <Sub title="8.2 Vacancy Notification Requirement">
                <P>The Accommodation Provider must notify APGP as soon as reasonably practicable after becoming aware that a Participant is likely to exit or has exited the accommodation. Failure to provide timely notification may affect APGP's ability to provide effective replacement support.</P>
              </Sub>
              <Sub title="8.3 Scope of Replacement Support">
                <P>Where the VPR is active and vacancy notification has been provided, APGP will use reasonable commercial efforts to:</P>
                <UL items={[
                  "Prioritise the Accommodation Provider in the referral pipeline.",
                  "Identify and introduce suitable replacement Participants.",
                  "Provide placement facilitation services for replacement Participants.",
                  "Coordinate introductions between the Accommodation Provider and potential replacement Participants.",
                ]} />
              </Sub>
              <Sub title="8.4 Limitations">
                <UL items={[
                  "APGP does not guarantee that a replacement Participant will be identified within any specific timeframe.",
                  "Replacement support is subject to factors outside APGP's control, including participant availability, choice, funding suitability, and geographic demand.",
                  "APGP is not responsible for any loss of income, vacancy duration, or commercial impact arising from an inability to identify a replacement Participant.",
                ]} />
              </Sub>
            </Clause>

            <Clause number="9" title="Information Sharing and Confidentiality">
              <Sub title="9.1 Confidential Information">
                <P>Confidential Information includes all non-public information disclosed in connection with the APGP, including: Participant information, profiles, and referral details; commercial terms, pricing, and fee structures; referral processes, methodologies, and operational procedures; business strategies, contacts, and market intelligence; and any information a reasonable person would consider confidential in the circumstances.</P>
              </Sub>
              <Sub title="9.2 Permitted Use">
                <P>Each party must use Confidential Information solely for the purposes of performing its obligations under this MOU and must not use it for any other purpose without the prior written consent of the disclosing party.</P>
              </Sub>
              <Sub title="9.3 Disclosure Restrictions">
                <P>Confidential Information may be disclosed only to employees, contractors, or advisers with a legitimate need to know and who are bound by equivalent confidentiality obligations. Confidential Information must not be disclosed to third parties except as permitted under this MOU or required by law.</P>
              </Sub>
              <Sub title="9.4 Participant Privacy">
                <P>Each party acknowledges that Participant information is sensitive and must be handled in accordance with the Privacy Act 1988 (Cth) and all applicable NDIS privacy requirements. Participant information must be shared only to the extent reasonably necessary to facilitate referrals or placement discussions under the APGP.</P>
              </Sub>
              <Sub title="9.5 Required Disclosure by Law">
                <P>A party may disclose Confidential Information where required by law, regulation, or a lawful request from a government or regulatory authority, provided that — where reasonably practicable — prior notice is given to the other party.</P>
              </Sub>
              <Sub title="9.6 Return or Destruction">
                <P>Upon termination or expiry of this MOU, each party must, upon request, return or securely destroy any Confidential Information of the other party, except to the extent that retention is required by law or for legitimate record-keeping purposes.</P>
              </Sub>
              <Sub title="9.7 Survival">
                <P>The obligations under this section survive termination or expiry of this MOU.</P>
              </Sub>
            </Clause>

            <Clause number="10" title="Marketing and Communications">
              <Sub title="10.1 Use of Names and Branding">
                <P>Neither party may use the name, logo, branding, or trademarks of the other party in any marketing, promotional, or public materials without prior written consent. Any approved use must comply with the reasonable brand guidelines of the owning party.</P>
              </Sub>
              <Sub title="10.2 No Endorsement or Representation">
                <P>Nothing in this MOU authorises either party to represent that it endorses, guarantees, or is responsible for the services, accommodation, or conduct of the other party. The Accommodation Provider must not represent that participation in the APGP constitutes approval, accreditation, or endorsement by APGP beyond the referral relationship described in this MOU.</P>
              </Sub>
              <Sub title="10.3 Compliance with Australian Consumer Law">
                <P>All marketing and communications relating to the APGP must comply with the Australian Consumer Law, including prohibitions against misleading or deceptive conduct. Neither party may make false, misleading, or unsubstantiated claims regarding referral volumes or guarantees; placement outcomes; regulatory approval or compliance status; or the nature or value of fees payable under this MOU.</P>
              </Sub>
              <Sub title="10.4 Communications with Participants">
                <P>All communications with Participants must respect Participant choice, autonomy, and decision-making. Neither party may pressure, coerce, or improperly influence a Participant to enter into an accommodation arrangement. Any explanation of the APGP to Participants must be factual, proportionate, and not misleading.</P>
              </Sub>
              <Sub title="10.5 Public Statements">
                <P>Neither party may issue public statements or media releases relating to this MOU or the APGP without prior written consent of the other party. This clause does not restrict disclosures required by law or regulatory authorities.</P>
              </Sub>
            </Clause>

            <Clause number="11" title="Term and Termination">
              <Sub title="11.1 Commencement and Term">
                <P>This MOU commences on the Commencement Date. Unless terminated earlier, this MOU continues for an initial term of twelve (12) months, and thereafter renews automatically on a rolling month-to-month basis.</P>
              </Sub>
              <Sub title="11.2 Termination for Convenience">
                <P>Either party may terminate this MOU for convenience by providing thirty (30) days' written notice to the other party. Termination for convenience does not affect any accrued rights or obligations existing at the date of termination.</P>
              </Sub>
              <Sub title="11.3 Termination for Cause">
                <P>Either party may terminate this MOU immediately by written notice if the other party:</P>
                <UL items={[
                  "Commits a material breach and fails to remedy it within fourteen (14) days of receiving written notice.",
                  "Engages in conduct that is unlawful, fraudulent, misleading, or deceptive.",
                  "Breaches applicable NDIS legislation, the NDIS Code of Conduct, or other regulatory obligations in a manner that may reasonably affect the reputation or compliance of the terminating party.",
                  "Becomes insolvent, enters administration or liquidation, or is otherwise unable to pay its debts as and when they fall due.",
                ]} />
              </Sub>
              <Sub title="11.4 Effect of Termination">
                <UL items={[
                  "The parties must cease representing that the APGP referral relationship continues.",
                  "APGP has no obligation to provide further referrals, replacement support, or priority access.",
                  "The Accommodation Provider remains liable for all fees accrued prior to termination.",
                  "Termination does not affect any provision which by its nature is intended to survive.",
                ]} />
              </Sub>
              <Sub title="11.5 Survival">
                <P>The following clauses survive termination or expiry: payment obligations (Section 7); confidentiality (Section 9); marketing restrictions (Section 10); dispute resolution and governing law (Section 14); and any other provision intended to survive by its nature.</P>
              </Sub>
            </Clause>

            <Clause number="12" title="Liability and Indemnities">
              <Sub title="12.1 Limitation of Liability">
                <P>To the maximum extent permitted by law, APGP's liability to the Accommodation Provider, whether in contract, tort (including negligence), equity, statute, or otherwise, is limited to the total fees paid by the Accommodation Provider to APGP in the six (6) months preceding the event giving rise to the claim. APGP is not liable for any indirect, consequential, incidental, special, or economic loss, including loss of profit, revenue, opportunity, or loss arising from vacancy periods. Nothing in this MOU limits liability that cannot be excluded by law.</P>
              </Sub>
              <Sub title="12.2 No Liability for Participant Decisions">
                <P>APGP is not liable for any loss, damage, or delay arising from: a Participant declining accommodation; a Participant exiting accommodation; a Participant's conduct, needs, or change in circumstances; or the Accommodation Provider's decision to accept or decline a Participant.</P>
              </Sub>
              <Sub title="12.3 Accommodation Provider Indemnity">
                <P>The Accommodation Provider indemnifies APGP against all claims, losses, damages, liabilities, costs, and expenses (including legal costs on a solicitor-client basis) arising out of or in connection with: the Accommodation Provider's accommodation services, property management, or tenancy arrangements; any breach of this MOU; any failure to comply with applicable laws or regulatory obligations; or any claim made by a Participant or third party relating to accommodation provided by the Accommodation Provider.</P>
              </Sub>
              <Sub title="12.4 Mutual Responsibility">
                <P>Each party remains responsible for its own acts and omissions and for complying with its respective legal and regulatory obligations.</P>
              </Sub>
            </Clause>

            <Clause number="13" title="Insurance">
              <Sub title="13.1 Required Insurance">
                <P>The Accommodation Provider must, at its own cost, maintain appropriate insurance throughout the term of this MOU, including:</P>
                <UL items={[
                  "Public Liability Insurance — minimum $10 million per occurrence.",
                  "Professional Indemnity Insurance (where applicable) — minimum $5 million per claim.",
                  "Any other insurance required by law or reasonably necessary having regard to the Accommodation Provider's operations.",
                ]} />
              </Sub>
              <Sub title="13.2 Evidence of Insurance">
                <P>Upon request, the Accommodation Provider must provide certificates of currency or other reasonable evidence of compliance with clause 13.1. Failure to provide evidence upon reasonable request may result in suspension of referrals until evidence is provided.</P>
              </Sub>
            </Clause>

            <Clause number="14" title="Dispute Resolution and Governing Law">
              <Sub title="14.1 Good Faith Negotiation">
                <P>If a dispute arises out of or in connection with this MOU, either party may give written notice specifying the nature of the dispute. The parties must use reasonable efforts to resolve the dispute through good faith negotiations between authorised representatives before commencing formal proceedings.</P>
              </Sub>
              <Sub title="14.2 Mediation">
                <P>If the dispute is not resolved within fourteen (14) days after notice is given under clause 14.1, either party may refer the dispute to mediation. Mediation must be conducted by a mediator agreed between the parties, or failing agreement, appointed by the President of the Law Society of New South Wales. Costs of mediation are shared equally unless otherwise agreed.</P>
              </Sub>
              <Sub title="14.3 Urgent Relief">
                <P>Nothing in this section prevents either party from seeking urgent interlocutory or injunctive relief where necessary to protect its rights, including in relation to unpaid fees, confidentiality, or misuse of information.</P>
              </Sub>
              <Sub title="14.4 Governing Law and Jurisdiction">
                <P>This MOU is governed by and construed in accordance with the laws of the State of New South Wales. The parties submit to the non-exclusive jurisdiction of the courts of New South Wales.</P>
              </Sub>
            </Clause>

            <Clause number="15" title="Regulatory Compliance">
              <Sub title="15.1 NDIS Regulatory Compliance">
                <P>Each party acknowledges and agrees that it must comply with all applicable legislation, rules, and standards relating to the National Disability Insurance Scheme, including the National Disability Insurance Scheme Act 2013 (Cth), the NDIS Practice Standards, and the NDIS Code of Conduct. Nothing in this MOU requires or permits either party to act inconsistently with those obligations.</P>
              </Sub>
              <Sub title="15.2 Australian Consumer Law">
                <P>Each party must comply with the Australian Consumer Law in connection with all conduct relating to this MOU. Neither party may engage in conduct that is misleading or deceptive, or likely to mislead or deceive, including in relation to referral volumes or outcomes, fees, or the nature of the relationship between the parties.</P>
              </Sub>
              <Sub title="15.3 No Improper Inducements">
                <P>All fees payable under this MOU are commercial business-to-business fees paid by the Accommodation Provider in consideration of referral, placement facilitation, and vacancy protection services. No fee, benefit, or incentive under this MOU is intended to improperly influence a Participant's decision-making or restrict Participant choice and control. Nothing in this MOU constitutes a prohibited inducement, kickback, or benefit under any applicable regulatory framework.</P>
              </Sub>
              <Sub title="15.4 Ethical Conduct">
                <P>Each party agrees to conduct itself ethically and professionally, including by acting honestly and transparently; avoiding conflicts of interest; promptly addressing any regulatory or compliance concerns; and cooperating with reasonable compliance-related requests made by the other party.</P>
              </Sub>
            </Clause>

            <Clause number="16" title="General Provisions">
              <Sub title="16.1 Assignment">
                <P>The Accommodation Provider must not assign, novate, or otherwise transfer any rights or obligations under this MOU without prior written consent of APGP, which must not be unreasonably withheld. APGP may assign or transfer its rights and obligations to a related entity or as part of a corporate restructure or sale of business by giving written notice to the Accommodation Provider.</P>
              </Sub>
              <Sub title="16.2 Waiver">
                <P>A waiver is effective only if given in writing. A failure or delay to exercise any right does not operate as a waiver of that right. A single or partial exercise of a right does not prevent further exercise.</P>
              </Sub>
              <Sub title="16.3 Severability">
                <P>If any provision is held to be invalid, illegal, or unenforceable, that provision is severed to the extent of the invalidity without affecting the validity or enforceability of the remaining provisions.</P>
              </Sub>
              <Sub title="16.4 Amendments">
                <P>This MOU may be amended only by a written document signed by authorised representatives of both parties.</P>
              </Sub>
              <Sub title="16.5 Entire Agreement">
                <P>This MOU constitutes the entire agreement between the parties in relation to the subject matter and supersedes all prior negotiations, representations, or agreements, whether written or oral.</P>
              </Sub>
              <Sub title="16.6 Counterparts and Electronic Execution">
                <P>This MOU may be executed in counterparts, each of which constitutes an original. Execution by electronic means (including electronic signature platforms) is valid and binding.</P>
              </Sub>
              <Sub title="16.7 Notices">
                <P>Any notice under this MOU must be in writing and may be given by email or other agreed electronic means. A notice is deemed received when sent, unless the sender receives an automated delivery failure message.</P>
              </Sub>
            </Clause>

          </div>

          {/* Schedule 2 — Fee Schedule */}
          <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-navy font-heading mb-2">Schedule 2 — Fee Schedule</h2>
            <p className="text-gray-500 text-sm mb-6">Payment Terms: Seven (7) days from invoice date unless otherwise agreed in writing. All fees are exclusive of GST unless stated otherwise. Tax invoices will be issued for all amounts payable.</p>
            <Table rows={[
              ["Placement Fee (standard)", "2% of annual NDIS funding allocation (min $3,000 / max $12,000) + GST", "Triggered on successful Placement (move-in or agreement execution)"],
              ["Placement Fee (VPR active — new vacancy)", "1% of annual NDIS funding allocation + GST", "Accommodation Provider holds active VPR at time of referral"],
              ["Replacement Placement Fee (VPR active)", "Nil (no additional fee)", "Replacement arising from exit of existing Participant, with active VPR"],
              ["Vacancy Protection Retainer (VPR)", "$150 per week + GST", "Optional. Commences on Participant move-in; ceases on exit"],
              ["Late Payment Administration Fee", "$50 + GST per overdue invoice", "Applied to amounts unpaid by the due date"],
            ]} />
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            © 2026 Silara Marketing (ACN 688042177). All rights reserved.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Partner with APGP?</h2>
          <p className="text-gray-300 mb-8">Register your organisation for free and our team will be in touch to discuss your partnership.</p>
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
