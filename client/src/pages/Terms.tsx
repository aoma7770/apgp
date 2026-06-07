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

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className="font-semibold text-navy mb-1">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

export default function Terms() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-14 lg:py-20">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Legal</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-4">Terms of Service (MOU)</h1>
          <p className="text-gray-300 text-base">
            Accommodation Provider Growth Program (APGP) — Memorandum of Understanding
          </p>
          <p className="text-gray-400 text-sm mt-2">Ausnew Support Services Pty Ltd · ABN: 31 620 493 941</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 bg-white">
        <div className="container max-w-3xl">
          <div className="bg-teal-light border border-teal/20 rounded-2xl p-6 text-center mb-8">
            <p className="text-base font-medium text-navy leading-relaxed">
              These Terms of Service constitute a binding Memorandum of Understanding between{" "}
              <strong>Ausnew Support Services Pty Ltd</strong> and participating accommodation providers.
            </p>
          </div>

          {/* Accordion */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <Clause number="1" title="Parties">
              <Sub title="1.1 Ausnew Support Services Pty Ltd">
                <P>This Memorandum of Understanding ("MOU") is entered into by <strong>Ausnew Support Services Pty Ltd</strong> (ABN: 31 620 493 941) ("Ausnew").</P>
                <P>Ausnew is an Australian business engaged in the provision of disability-related services and operates the Accommodation Provider Growth Program (APGP), a business-to-business program designed to support accommodation providers with participant referrals, placement facilitation, and ongoing vacancy management support.</P>
              </Sub>
              <Sub title="1.2 Accommodation Provider">
                <P>The other party to this MOU is the entity identified in the execution page of this document ("Accommodation Provider").</P>
                <P>The Accommodation Provider is an organisation that owns, manages, leases, or otherwise operates disability accommodation (including but not limited to SDA, SIL, STA, MTA or similar accommodation arrangements) and is willing to participate in the APGP in accordance with the terms of this MOU.</P>
              </Sub>
              <Sub title="1.3 Background and Purpose of the MOU">
                <UL items={[
                  "Ausnew has developed the Accommodation Provider Growth Program (APGP) to facilitate introductions between accommodation providers and suitable participants, with the objective of reducing vacancy periods and supporting sustainable occupancy outcomes.",
                  "The Accommodation Provider wishes to participate in the APGP and receive referrals of potential participants, subject to the terms and conditions set out in this MOU.",
                  "This MOU sets out the commercial framework, roles and responsibilities, and fee arrangements governing the relationship between Ausnew and the Accommodation Provider under the APGP.",
                  "This MOU is intended to be legally binding, except where expressly stated otherwise, and establishes the basis upon which the parties will cooperate in relation to referral-based placements under the Referral Partnership Model; and/or collaborative arrangements under the Joint Venture (JV) Partnership Model.",
                  "Nothing in this MOU is intended to, nor does it: create a partnership, agency, or employment relationship between the parties; or limit the Accommodation Provider's obligations to comply with all applicable laws, including the NDIS Act, NDIS Practice Standards, and the Australian Consumer Law.",
                ]} />
              </Sub>
            </Clause>

            <Clause number="2" title="Definition and Interpretation">
              <Sub title="2.1 Definitions">
                <UL items={[
                  <><strong>Accommodation Provider</strong> — the entity identified in clause 1.2 that participates in the APGP.</>,
                  <><strong>APGP</strong> — the Accommodation Provider Growth Program operated by Ausnew, being a business-to-business referral and growth program for accommodation providers.</>,
                  <><strong>Business Day</strong> — a day other than a Saturday, Sunday, or public holiday in the relevant jurisdiction.</>,
                  <><strong>Confidential Information</strong> — all information disclosed by one party to the other in connection with this MOU that is not publicly available, including participant information, commercial terms, pricing, operational processes, referral data, and business strategies.</>,
                  <><strong>GST</strong> — has the meaning given to it in the A New Tax System (Goods and Services Tax) Act 1999 (Cth).</>,
                  <><strong>JV Partnership Model</strong> — the partnership pathway under the APGP where Ausnew and the Accommodation Provider collaborate in the delivery of certain services in respect of a participant, as elected under Schedule 1.</>,
                  <><strong>MOU</strong> — this Memorandum of Understanding, including all schedules and any amendments made in accordance with its terms.</>,
                  <><strong>Participant</strong> — a person with disability who may be introduced or referred to the Accommodation Provider through the APGP.</>,
                  <><strong>Placement</strong> — the successful introduction of a Participant to the Accommodation Provider resulting in the Participant entering into an accommodation arrangement.</>,
                  <><strong>Placement Fee</strong> — the one-off, success-based fee payable by the Accommodation Provider to Ausnew upon a successful Placement, as set out in Schedule 2.</>,
                  <><strong>Referral Partnership Model</strong> — the partnership pathway under the APGP where Ausnew provides referral and placement facilitation services only, without ongoing service delivery.</>,
                  <><strong>Subscription Fee</strong> — the ongoing weekly fee payable by the Accommodation Provider while a referred Participant remains in the accommodation, as set out in Schedule 2.</>,
                ]} />
              </Sub>
              <Sub title="2.2 Interpretation">
                <P>In this MOU, unless the context otherwise requires: headings are for convenience only and do not affect interpretation; words importing the singular include the plural and vice versa; references to a person include a body corporate, trust, partnership or other legal entity; references to legislation include all amendments, re-enactments and subordinate legislation; "including" and similar expressions are not words of limitation; and an obligation not to do something includes an obligation not to permit that thing to be done.</P>
              </Sub>
              <Sub title="2.3 Priority of Documents">
                <P>In the event of any inconsistency between this MOU and any schedule or annexure, the following order of precedence applies: this MOU (excluding schedules); Schedule 1 (Partnership Model Election); Schedule 2 (Fee Schedule); and any other schedules or annexures.</P>
              </Sub>
            </Clause>

            <Clause number="3" title="Nature of the Relationship">
              <Sub title="3.1 Independent Contracting Relationship">
                <P>The parties acknowledge and agree that they enter into this MOU as independent contracting parties. Nothing in this MOU creates, or is intended to create, any relationship of partnership, joint venture (except to the limited extent expressly described under the JV Partnership Model), agency, employment, or fiduciary relationship between the parties.</P>
              </Sub>
              <Sub title="3.2 No Partnership, Agency or Employment">
                <UL items={[
                  "Neither party has authority to act on behalf of, represent, or bind the other.",
                  "Neither party is the agent, partner, or legal representative of the other.",
                  "Neither party is responsible for the acts, omissions, or liabilities of the other.",
                ]} />
                <P>For the avoidance of doubt, the use of the term "joint venture" in relation to the JV Partnership Model refers solely to a commercial collaboration framework and does not constitute a legal partnership or joint venture at law.</P>
              </Sub>
              <Sub title="3.3 No Authority to Bind">
                <P>Neither party may: make any representation, warranty, or commitment on behalf of the other; enter into any agreement purporting to bind the other; or hold itself out as having authority to act for or on behalf of the other, unless expressly authorised in writing under this MOU.</P>
              </Sub>
              <Sub title="3.4 Compliance with Laws">
                <P>Each party is solely responsible for ensuring its own compliance with all applicable laws, regulations, and standards, including but not limited to: the National Disability Insurance Scheme Act 2013 (Cth); the NDIS Practice Standards and NDIS Code of Conduct; the Australian Consumer Law; and any other applicable Commonwealth, State or Territory legislation.</P>
              </Sub>
            </Clause>

            <Clause number="4" title="Program Overview — Accommodation Provider Growth Program (APGP)">
              <Sub title="4.1 Overview of APGP">
                <P>The Accommodation Provider Growth Program (APGP) is a business-to-business referral and growth program operated by Ausnew. Under the APGP, Ausnew identifies and introduces suitable participants to accommodation providers with the objective of facilitating placement outcomes and supporting reduced vacancy periods, in accordance with the partnership model elected by the Accommodation Provider under this MOU.</P>
              </Sub>
              <Sub title="4.2 Objectives of the Program">
                <UL items={[
                  "Assist accommodation providers to improve occupancy outcomes through access to suitable participant referrals.",
                  "Reduce vacancy periods and associated commercial risk.",
                  "Streamline referral, placement, and engagement processes.",
                  "Establish an ongoing commercial referral relationship between Ausnew and the Accommodation Provider.",
                ]} />
              </Sub>
              <Sub title="4.3 Non-Exclusive Participation">
                <P>Participation in the APGP is non-exclusive. The Accommodation Provider remains free to receive referrals from, and engage with, other referral sources, support coordinators, or third parties. Ausnew is not required to refer participants exclusively to the Accommodation Provider.</P>
              </Sub>
              <Sub title="4.4 No Guarantee of Referrals or Placements">
                <UL items={[
                  "Ausnew does not guarantee the number, frequency, or suitability of referrals provided under the APGP.",
                  "Any referral or introduction does not guarantee a Placement.",
                  "All placement decisions remain subject to the Participant's independent choice and the Accommodation Provider's own assessment processes.",
                ]} />
              </Sub>
              <Sub title="4.5 Participant Choice and Provider Discretion">
                <UL items={[
                  "All participants retain full choice and control in relation to their accommodation decisions.",
                  "The Accommodation Provider retains sole discretion as to whether to accept or decline any referred Participant.",
                  "Ausnew does not direct, compel, or influence a Participant to enter into an accommodation arrangement.",
                ]} />
              </Sub>
            </Clause>

            <Clause number="5" title="Participant Safeguards and NDIS Compliance">
              <Sub title="5.1 Participant Choice and Control">
                <UL items={[
                  "All Participants retain full choice and control in relation to accommodation, support providers, and services.",
                  "Participation in the APGP does not restrict or influence a Participant's right to choose or change accommodation providers or support arrangements.",
                  "No Participant is required, encouraged, or induced to enter into an accommodation arrangement as a result of this MOU.",
                ]} />
              </Sub>
              <Sub title="5.2 No Fees Charged to Participants">
                <UL items={[
                  "All fees payable under this MOU, including any Placement Fee or Subscription Fee, are payable solely by the Accommodation Provider.",
                  "No fees are charged to Participants, their families, nominees, guardians, or representatives.",
                  "No fees under this MOU are deducted from, invoiced to, or claimed against a Participant's NDIS plan.",
                ]} />
              </Sub>
              <Sub title="5.3 No Claims Against the NDIS">
                <UL items={[
                  "Fees payable under this MOU are commercial business-to-business fees.",
                  "Such fees do not constitute NDIS supports or services.",
                  "No claim will be made to the National Disability Insurance Agency, a plan manager, or the NDIS for any amounts payable under this MOU.",
                ]} />
              </Sub>
              <Sub title="5.4 Conflict of Interest Management">
                <P>The parties must manage and disclose any actual, potential, or perceived conflicts of interest arising in connection with referrals under the APGP. Ausnew must not influence a Participant's accommodation decision for commercial benefit. The Accommodation Provider must not require or pressure a Participant to engage particular supports, services, or providers as a condition of accommodation.</P>
              </Sub>
              <Sub title="5.5 Compliance with the NDIS Code of Conduct">
                <P>Each party warrants that it will comply with the NDIS Code of Conduct, including obligations to: act with respect for individual rights to freedom of expression, self-determination and decision-making; provide supports and services in a safe, competent and ethical manner; prevent and respond to abuse, neglect and exploitation; and take all reasonable steps to prevent violence, misconduct, or restrictive practices.</P>
              </Sub>
              <Sub title="5.6 Transparency and Disclosure">
                <P>The Accommodation Provider acknowledges that Participants may be informed, in general terms, that Ausnew receives commercial fees from accommodation providers for referral and placement services. Any such disclosure must be accurate, not misleading, and must not imply endorsement, coercion, or preferential treatment. Neither party may make representations that are false, misleading, or deceptive within the meaning of the Australian Consumer Law.</P>
              </Sub>
              <Sub title="5.7 No Improper Inducements">
                <P>The parties agree that no payment, benefit, or incentive under this MOU is intended to improperly influence a Participant's decision-making. Fees under this MOU are payable solely in consideration of referral, placement facilitation, and ongoing commercial relationship services provided to the Accommodation Provider. Nothing in this MOU constitutes an inducement, kickback, or prohibited benefit under the NDIS regulatory framework.</P>
              </Sub>
            </Clause>

            <Clause number="6" title="Partnership Pathways">
              <Sub title="6.1 Overview of Available Partnership Models">
                <P>Under the APGP, Ausnew offers accommodation providers the opportunity to participate under one of the following partnership pathways: the Referral Partnership Model; and/or the Joint Venture (JV) Partnership Model. Each partnership pathway is designed to accommodate different operational arrangements and is elected in accordance with this MOU.</P>
              </Sub>
              <Sub title="6.2 Election of Partnership Model">
                <UL items={[
                  "The Accommodation Provider must elect its preferred partnership pathway by completing Schedule 1 (Partnership Model Election).",
                  "The Accommodation Provider may elect to participate in one or both partnership pathways, subject to Ausnew's agreement and any applicable conditions set out in this MOU.",
                  "No services will be provided under a particular partnership pathway unless that pathway has been expressly elected in Schedule 1.",
                ]} />
              </Sub>
              <Sub title="6.3 Non-Exclusivity of Partnership Models">
                <P>Election of a partnership pathway under this MOU does not create any exclusivity in favour of either party. The Accommodation Provider may engage in other referral or partnership arrangements with third parties. Ausnew may introduce Participants to other accommodation providers where appropriate.</P>
              </Sub>
              <Sub title="6.4 Change of Partnership Model">
                <P>The Accommodation Provider may request to change its elected partnership pathway by providing written notice to Ausnew. Any change will only take effect once agreed in writing by both parties. A change of partnership pathway does not affect accrued rights, fees, or obligations arising prior to the change.</P>
              </Sub>
              <Sub title="6.5 Separate Application of Partnership Terms">
                <P>The terms and conditions applicable to each partnership pathway are set out separately in this MOU. Where the Accommodation Provider participates under the Referral Partnership Model, the provisions of Section 7 apply. Where the Accommodation Provider participates under the JV Partnership Model, the provisions of Section 8 apply.</P>
              </Sub>
            </Clause>

            <Clause number="7" title="Referral Partnership Model">
              <Sub title="7.1 Scope of Referral Services">
                <P>Under the Referral Partnership Model, Ausnew agrees to provide the Accommodation Provider with referral and placement facilitation services, which may include: identifying and introducing suitable Participants; facilitating initial introductions; and supporting communication and coordination during the placement process. For the avoidance of doubt, Ausnew does not provide ongoing accommodation services, care services, or supports to Participants under the Referral Partnership Model.</P>
              </Sub>
              <Sub title="7.2 Referral Process">
                <P>Ausnew may, from time to time, refer Participants to the Accommodation Provider based on available information regarding participant needs and accommodation suitability. Each referral is provided on a non-exclusive basis and does not guarantee a Placement. The Accommodation Provider retains sole discretion to accept or decline any referred Participant.</P>
              </Sub>
              <Sub title="7.3 Accommodation Provider Obligations">
                <UL items={[
                  "Independently assess the suitability of any referred Participant.",
                  "Communicate directly with the Participant regarding accommodation arrangements.",
                  "Ensure that any accommodation offered complies with all applicable legal and regulatory requirements.",
                  "Make all final decisions regarding acceptance, terms, and conditions of accommodation.",
                ]} />
              </Sub>
              <Sub title="7.4 Ausnew Obligations">
                <UL items={[
                  "Act in good faith when identifying and referring Participants.",
                  "Provide accurate information to the extent reasonably available.",
                  "Not misrepresent the Participant, the Accommodation Provider, or the nature of the referral.",
                ]} />
              </Sub>
              <Sub title="7.5 No Ongoing Service Delivery">
                <P>Under the Referral Partnership Model, Ausnew does not provide ongoing services, supports, or accommodation management to the Participant. The Accommodation Provider is solely responsible for all accommodation arrangements, services, and obligations relating to the Participant following a Placement.</P>
              </Sub>
              <Sub title="7.6 Referral Acknowledgement">
                <P>A referral will be deemed to have occurred where Ausnew introduces a Participant to the Accommodation Provider and that introduction materially contributes to a Placement. The Accommodation Provider acknowledges that referral fees payable under this MOU are consideration for referral and placement facilitation services provided by Ausnew.</P>
              </Sub>
              <Sub title="7.7 No Obligation to Proceed">
                <P>Nothing in this MOU obliges the Accommodation Provider to enter into an accommodation arrangement with any referred Participant. Nothing in this MOU obliges Ausnew to continue referring Participants to the Accommodation Provider.</P>
              </Sub>
            </Clause>

            <Clause number="8" title="Joint Venture (JV) Partnership Model">
              <Sub title="8.1 Scope of JV Services">
                <P>Under the Joint Venture (JV) Partnership Model, Ausnew and the Accommodation Provider may collaborate in relation to a Participant where Ausnew provides limited, agreed services in conjunction with the Accommodation Provider's accommodation offering. The JV Partnership Model is a commercial collaboration framework only and operates strictly in accordance with the terms of this MOU and the partnership election made under Schedule 1.</P>
              </Sub>
              <Sub title="8.2 Shared Service Delivery Framework">
                <UL items={[
                  "Where the JV Partnership Model is elected, Ausnew may provide specified services to the Participant, which may include community access or other agreed supports, subject to the Participant's choice and applicable service agreements.",
                  "The Accommodation Provider remains solely responsible for the provision and management of accommodation services.",
                  "The parties acknowledge that services provided by Ausnew and the Accommodation Provider are separate and distinct, notwithstanding any operational coordination.",
                ]} />
              </Sub>
              <Sub title="8.3 Roles and Responsibilities">
                <UL items={[
                  "Ausnew is responsible only for the services expressly agreed to be provided by it under the JV Partnership Model.",
                  "The Accommodation Provider is responsible for all accommodation-related obligations, including compliance, safety, tenancy arrangements, and property management.",
                  "Neither party assumes responsibility for the other's obligations, services, or regulatory compliance.",
                ]} />
              </Sub>
              <Sub title="8.4 Minimum Service Thresholds">
                <P>Any minimum service thresholds or service parameters applicable to the JV Partnership Model must be agreed in writing between the parties. Nothing in this MOU obliges Ausnew to provide services beyond those expressly agreed, nor obliges the Accommodation Provider to engage Ausnew for services not elected.</P>
              </Sub>
              <Sub title="8.5 Operational Coordination">
                <P>The parties may coordinate operational matters to facilitate effective service delivery, including communication regarding Participant needs and scheduling. Such coordination does not create any authority for either party to act on behalf of the other.</P>
              </Sub>
              <Sub title="8.6 No Transfer of Control">
                <P>The Accommodation Provider retains full control over its accommodation operations at all times. Ausnew retains full control over the services it provides. Nothing in this section transfers decision-making authority, management control, or responsibility from one party to the other.</P>
              </Sub>
            </Clause>

            <Clause number="9" title="Fees and Commercial Terms">
              <Sub title="9.1 Placement Fee">
                <P>Under the Referral Partnership Model and, where applicable, the JV Partnership Model, the Accommodation Provider agrees to pay Ausnew a one-off, success-based placement fee ("Placement Fee") in respect of each successful Placement.</P>
                <P>The Placement Fee is calculated as <strong>two per cent (2%) of the Participant's annual NDIS funding allocation</strong>, subject to the following thresholds:</P>
                <UL items={[
                  "A minimum Placement Fee of $3,000 plus GST.",
                  "A maximum Placement Fee of $12,000 plus GST.",
                ]} />
                <P>The Placement Fee is payable only upon a successful Placement, being when the Participant: enters into an accommodation agreement with the Accommodation Provider; or physically moves into the accommodation, whichever occurs first, unless otherwise agreed in writing.</P>
                <P>The Placement Fee is a commercial business-to-business fee and is <strong>not charged to, deducted from, or claimed against a Participant's NDIS plan</strong>.</P>
              </Sub>
              <Sub title="9.2 Payment Arrangements for Placement Fee">
                <P>Unless otherwise agreed in writing, the Placement Fee is payable in full upon invoicing. By agreement, Ausnew may permit the Placement Fee to be paid by instalments, provided that the Placement Fee is paid in full within sixty (60) days of the Placement trigger event.</P>
              </Sub>
              <Sub title="9.3 Vacancy Protection Plan (VPP)">
                <P>The Accommodation Provider may elect to pay an optional Vacancy Protection Retainer ("VPR") in the amount of <strong>$150 per week plus GST</strong>. The VPR is payable in consideration of ongoing vacancy replacement support, priority referral access, and placement continuity services provided by Ausnew.</P>
                <P>The VPR: commences on the date the Participant moves into the accommodation; applies only while the Participant remains in residence; and ceases automatically when the Participant exits the accommodation. The VPR applies at the provider level and covers all properties operated by the Accommodation Provider during the period in which the VPR is active.</P>
              </Sub>
              <Sub title="Benefits of the Vacancy Protection Plan">
                <UL items={[
                  <><strong>Replacement Without Additional Placement Fee:</strong> If a Participant exits the accommodation, Ausnew will prioritise sourcing a suitable replacement Participant and no additional Placement Fee will be payable for the replacement Placement.</>,
                  <><strong>Priority Referral Access:</strong> The Accommodation Provider will receive priority access to suitable new Participant referrals ahead of non-subscribed providers.</>,
                  <><strong>Reduced Placement Fee for New Vacancies:</strong> For new vacancies not arising from replacement of an exited Participant, the Placement Fee is reduced to one per cent (1%) of the Participant's annual NDIS funding allocation while the VPR remains active.</>,
                ]} />
              </Sub>
              <Sub title="9.5 Opt-Out of Vacancy Protection Plan">
                <P>Participation in the VPR is optional. Where the Accommodation Provider does not elect, or ceases, the VPR: Ausnew has no obligation to provide vacancy replacement support; the Accommodation Provider will not receive priority referral access; and all future placements will be subject to the standard Placement Fee under clause 9.1.</P>
              </Sub>
              <Sub title="9.6 GST">
                <P>All fees payable under this MOU are exclusive of GST unless expressly stated otherwise. GST is payable in addition to the relevant fee in accordance with the A New Tax System (Goods and Services Tax) Act 1999 (Cth).</P>
              </Sub>
              <Sub title="9.7 Invoicing and Payment Terms">
                <P>Ausnew will issue tax invoices for all fees payable under this MOU. Unless otherwise agreed in writing: Placement Fees are invoiced upon the trigger event set out in clause 9.1; and VPP fees may be invoiced monthly in arrears based on the applicable weekly rate. Payment terms are <strong>seven (7) days from invoice date</strong>, unless otherwise specified in Schedule 2.</P>
              </Sub>
              <Sub title="9.8 Outstanding Payments and Late Payment Administration Fee">
                <P>Any amount payable under this MOU that is not paid by the due date will be deemed an overdue amount. In respect of any overdue amount, Ausnew may charge a late payment administration fee of <strong>$50 plus GST per overdue invoice</strong>, representing a genuine pre-estimate of the reasonable administrative costs incurred by Ausnew in managing and following up late payments. Ausnew may suspend the provision of further referrals, vacancy replacement support, or participation in the APGP until all overdue amounts are paid in full.</P>
              </Sub>
              <Sub title="9.9 Debt Recovery">
                <P>If any undisputed amount payable under this MOU remains unpaid for more than thirty (30) days after the due date, Ausnew may take reasonable steps to recover the outstanding amount, including referring the overdue amount to an external debt collection agency or commencing legal proceedings. The Accommodation Provider agrees to indemnify Ausnew for all reasonable costs and expenses incurred in connection with debt recovery. Ausnew must not, and will not, engage in any debt recovery action involving a Participant or a Participant's NDIS funding.</P>
              </Sub>
              <Sub title="9.10 Survival of Payment Obligations">
                <P>The Accommodation Provider's obligation to pay any outstanding Placement Fees, Vacancy Protection Plan fees, late payment administration fees, and recovery costs survives termination or expiry of this MOU.</P>
              </Sub>
            </Clause>

            <Clause number="10" title="Replacement and Vacancy Support">
              <Sub title="10.1 Purpose">
                <P>The purpose of this section is to set out the scope of replacement and vacancy support services provided by Ausnew to Accommodation Providers that elect to maintain an active Vacancy Protection Plan (VPP). The parties acknowledge that vacancy replacement services are provided on a reasonable efforts basis and are subject to Participant choice and availability.</P>
              </Sub>
              <Sub title="10.2 Eligibility for Replacement Support">
                <P>Replacement and vacancy support under this section is available only to Accommodation Providers that maintain an active and current VPP at the time a Participant exits the accommodation. Where the VPR is not active at the time of exit, Ausnew has no obligation to provide replacement or vacancy support.</P>
              </Sub>
              <Sub title="10.3 Vacancy Notification Requirement">
                <P>The Accommodation Provider must notify Ausnew as soon as reasonably practicable after becoming aware that a Participant is likely to exit or has exited the accommodation. Failure to provide timely notification may affect Ausnew's ability to provide effective replacement support.</P>
              </Sub>
              <Sub title="10.4 Scope of Replacement Support">
                <P>Where the VPR is active and vacancy notification has been provided, Ausnew will use reasonable commercial efforts to: prioritise the Accommodation Provider in the referral pipeline; identify and introduce suitable replacement Participants; provide placement facilitation services for replacement Participants; and coordinate introductions between the Accommodation Provider and potential replacement Participants.</P>
              </Sub>
              <Sub title="10.5 No Additional Placement Fee for Replacement">
                <P>Where a replacement Participant is successfully placed following a Participant exit and the Accommodation Provider maintains an active VPP, no additional Placement Fee will be payable for the replacement Placement. For the avoidance of doubt, the VPR does not entitle the Accommodation Provider to an unlimited number of free placements and applies only to replacement placements arising from the exit of an existing Participant.</P>
              </Sub>
              <Sub title="10.6 Priority Access to Replacement Opportunities">
                <P>Accommodation Providers with an active VPP will receive priority access to suitable replacement Participants ahead of Accommodation Providers that do not maintain a VPR. Priority access does not guarantee placement and remains subject to Participant choice and suitability.</P>
              </Sub>
              <Sub title="10.7 Limitations on Replacement Support">
                <UL items={[
                  "Ausnew does not guarantee that a replacement Participant will be identified within any specific timeframe.",
                  "Replacement support is subject to factors outside Ausnew's control, including Participant availability, Participant choice, funding suitability, and geographic demand.",
                  "Ausnew is not responsible for any loss of income, vacancy duration, or commercial impact arising from an inability to identify a replacement Participant.",
                ]} />
              </Sub>
              <Sub title="10.8 Interaction with New Vacancies">
                <P>Replacement support under this section applies only to vacancies arising from the exit of an existing Participant. For new vacancies unrelated to a replacement scenario, the fee arrangements set out in clause 9.4(c) apply.</P>
              </Sub>
              <Sub title="10.9 Suspension or Termination of Replacement Support">
                <P>Ausnew may suspend replacement support where the Accommodation Provider is in breach of this MOU, including for non-payment of fees. Termination or expiry of this MOU immediately terminates any entitlement to replacement and vacancy support.</P>
              </Sub>
            </Clause>

            <Clause number="11" title="Information Sharing and Confidentiality">
              <Sub title="11.1 Confidential Information">
                <P>For the purposes of this MOU, Confidential Information includes all information disclosed by one party to the other in connection with the APGP, whether disclosed orally, electronically, or in writing, including but not limited to: Participant information, profiles, and referral details; commercial terms, pricing, fee structures, and schedules; referral processes, methodologies, and operational procedures; business strategies, contacts, and market intelligence; and any information designated as confidential or which a reasonable person would consider confidential in the circumstances.</P>
              </Sub>
              <Sub title="11.2 Permitted Use of Information">
                <P>Each party must use Confidential Information solely for the purposes of performing its obligations under this MOU. Confidential Information must not be used for any other purpose without the prior written consent of the disclosing party.</P>
              </Sub>
              <Sub title="11.3 Disclosure Restrictions">
                <P>Each party must take all reasonable steps to protect the Confidential Information of the other party from unauthorised access, disclosure, or misuse. Confidential Information may be disclosed only to employees, contractors, or advisers who have a legitimate need to know the information for the purposes of this MOU and who are bound by confidentiality obligations no less stringent than those set out in this section. Confidential Information must not be disclosed to third parties except as permitted under this MOU or required by law.</P>
              </Sub>
              <Sub title="11.4 Participant Information and Privacy">
                <P>Each party acknowledges that Participant information is sensitive and must be handled in accordance with applicable privacy laws, including the Privacy Act 1988 (Cth) and any applicable NDIS privacy requirements. Participant information must be shared only to the extent reasonably necessary to facilitate referrals, placement discussions, or replacement support under the APGP. Nothing in this MOU permits the sale, misuse, or unauthorised disclosure of Participant information.</P>
              </Sub>
              <Sub title="11.5 Required Disclosure by Law">
                <P>A party may disclose Confidential Information where required to do so by law, regulation, or a lawful request from a government or regulatory authority, provided that, where reasonably practicable, the disclosing party gives prior notice to the other party.</P>
              </Sub>
              <Sub title="11.6 Return or Destruction of Confidential Information">
                <P>Upon termination or expiry of this MOU, each party must, upon request, return or securely destroy any Confidential Information of the other party, except to the extent that retention is required by law or for legitimate record-keeping purposes.</P>
              </Sub>
              <Sub title="11.7 Survival">
                <P>The obligations under this section survive termination or expiry of this MOU.</P>
              </Sub>
            </Clause>

            <Clause number="12" title="Marketing and Communications">
              <Sub title="12.1 Use of Names and Branding">
                <P>Neither party may use the name, logo, branding, or trademarks of the other party in any marketing, promotional, or public materials without the prior written consent of the other party. Any approved use of names or branding must comply with the brand guidelines and reasonable directions of the owning party.</P>
              </Sub>
              <Sub title="12.2 No Endorsement or Representation">
                <P>Nothing in this MOU authorises either party to represent that it endorses, guarantees, or is responsible for the services, accommodation, or conduct of the other party. The Accommodation Provider must not represent that participation in the APGP constitutes approval, accreditation, or endorsement by Ausnew. Ausnew must not represent that the Accommodation Provider is approved, preferred, or endorsed beyond the scope of the APGP referral relationship.</P>
              </Sub>
              <Sub title="12.3 Compliance with Australian Consumer Law">
                <P>All marketing and communications relating to the APGP must comply with the Australian Consumer Law, including prohibitions against misleading or deceptive conduct. Neither party may make false, misleading, or unsubstantiated claims regarding: referral volumes or guarantees; placement outcomes; regulatory approval or compliance status; or the nature or value of fees payable under this MOU.</P>
              </Sub>
              <Sub title="12.4 Communications with Participants">
                <P>All communications with Participants must respect Participant choice, autonomy, and decision-making. Neither party may pressure, coerce, or improperly influence a Participant to enter into an accommodation arrangement or support relationship. Any explanation of the APGP to Participants must be factual, proportionate, and not misleading.</P>
              </Sub>
              <Sub title="12.5 Public Statements">
                <P>Neither party may issue public statements or media releases relating to this MOU or the APGP without the prior written consent of the other party. This clause does not restrict disclosures required by law or regulatory authorities.</P>
              </Sub>
            </Clause>

            <Clause number="13" title="Term and Termination">
              <Sub title="13.1 Commencement and Term">
                <P>This MOU commences on the date it is executed by both parties ("Commencement Date"). Unless terminated earlier in accordance with this section, this MOU continues for an initial term of <strong>twelve (12) months</strong>, and thereafter renews automatically on a rolling month-to-month basis.</P>
              </Sub>
              <Sub title="13.2 Termination for Convenience">
                <P>Either party may terminate this MOU for convenience by providing <strong>thirty (30) days' written notice</strong> to the other party. Termination for convenience does not affect any accrued rights or obligations existing at the date of termination.</P>
              </Sub>
              <Sub title="13.3 Termination for Cause">
                <P>Either party may terminate this MOU immediately by written notice if the other party: commits a material breach of this MOU and fails to remedy that breach within fourteen (14) days of receiving written notice; engages in conduct that is unlawful, fraudulent, misleading, or deceptive; breaches applicable NDIS legislation, the NDIS Code of Conduct, or other regulatory obligations in a manner that may reasonably affect the reputation or compliance of the terminating party; or becomes insolvent, enters administration, liquidation, or is otherwise unable to pay its debts as and when they fall due.</P>
              </Sub>
              <Sub title="13.4 Effect of Termination">
                <UL items={[
                  "The parties must cease representing that the APGP relationship continues.",
                  "Ausnew has no obligation to provide further referrals, replacement support, or priority access under the APGP.",
                  "The Accommodation Provider remains liable for all fees accrued prior to termination, including Placement Fees, Vacancy Protection Retainer fees, late payment administration fees, and recovery costs.",
                  "Termination does not affect any provision which by its nature is intended to survive termination.",
                ]} />
              </Sub>
              <Sub title="13.5 Survival of Key Obligations">
                <P>The following clauses survive termination or expiry of this MOU: payment and recovery obligations (Section 9); confidentiality and information handling (Section 11); marketing and communications restrictions (Section 12); dispute resolution and governing law (Section 16); and any other provision which by its nature is intended to survive.</P>
              </Sub>
            </Clause>

            <Clause number="14" title="Liability and Indemnities">
              <Sub title="14.1 Limitation of Liability">
                <P>To the maximum extent permitted by law, Ausnew's liability to the Accommodation Provider in connection with this MOU, whether arising in contract, tort (including negligence), equity, statute or otherwise, is limited to the total amount of fees paid by the Accommodation Provider to Ausnew under this MOU in the <strong>six (6) months preceding the event</strong> giving rise to the claim. Ausnew is not liable for any indirect, consequential, incidental, special or economic loss, including loss of profit, loss of revenue, loss of opportunity, or loss arising from vacancy periods. Nothing in this MOU limits liability that cannot be excluded by law.</P>
              </Sub>
              <Sub title="14.2 No Liability for Participant Decisions">
                <P>The Accommodation Provider acknowledges that all placement outcomes are subject to Participant choice and decision-making. Ausnew is not liable for any loss, damage, or delay arising from: a Participant declining accommodation; a Participant exiting accommodation; a Participant's conduct, needs, or change in circumstances; or the Accommodation Provider's decision to accept or decline a Participant.</P>
              </Sub>
              <Sub title="14.3 Accommodation Provider Indemnity">
                <P>The Accommodation Provider indemnifies Ausnew against all claims, losses, damages, liabilities, costs, and expenses (including legal costs on a solicitor–client basis) arising out of or in connection with: the Accommodation Provider's accommodation services, property management, or tenancy arrangements; any breach of this MOU by the Accommodation Provider; any failure by the Accommodation Provider to comply with applicable laws or regulatory obligations; or any claim made by a Participant or third party relating to accommodation provided by the Accommodation Provider.</P>
              </Sub>
              <Sub title="14.4 No Indemnity for Ausnew's Services">
                <P>Ausnew does not indemnify the Accommodation Provider for any loss arising from the Accommodation Provider's business operations or accommodation services. Nothing in this clause requires Ausnew to indemnify the Accommodation Provider for matters outside Ausnew's control.</P>
              </Sub>
              <Sub title="14.5 Mutual Liability Preservation">
                <P>Each party remains responsible for its own acts and omissions and for complying with its respective legal and regulatory obligations.</P>
              </Sub>
            </Clause>

            <Clause number="15" title="Insurance">
              <Sub title="15.1 Required Insurance">
                <P>The Accommodation Provider must, at its own cost, maintain throughout the term of this MOU appropriate and adequate insurance policies with reputable insurers, including:</P>
                <UL items={[
                  "Public Liability Insurance with a minimum cover of not less than $10 million per occurrence.",
                  "Professional Indemnity Insurance (where applicable) with a minimum cover of not less than $5 million per claim.",
                  "Any other insurance required by law or reasonably necessary having regard to the nature of the Accommodation Provider's operations and obligations.",
                ]} />
              </Sub>
              <Sub title="15.2 Evidence of Insurance">
                <P>Upon request by Ausnew, the Accommodation Provider must provide certificates of currency or other reasonable evidence demonstrating compliance with clause 15.1. Failure to provide evidence of insurance upon reasonable request may result in suspension of referrals until such evidence is provided.</P>
              </Sub>
              <Sub title="15.3 Maintenance of Insurance">
                <P>The Accommodation Provider must ensure that all required insurance policies: remain current and valid for the duration of this MOU; are maintained on terms no less favourable than those in effect at the Commencement Date; and are sufficient to cover foreseeable risks associated with the Accommodation Provider's accommodation services.</P>
              </Sub>
              <Sub title="15.4 No Limitation of Liability">
                <P>The existence of insurance under this section does not limit or reduce the Accommodation Provider's obligations, liabilities, or indemnities under this MOU.</P>
              </Sub>
            </Clause>

            <Clause number="16" title="Dispute Resolution">
              <Sub title="16.1 Good Faith Negotiation">
                <P>If a dispute arises out of or in connection with this MOU ("Dispute"), either party may give written notice to the other party specifying the nature of the Dispute. The parties must use reasonable efforts to resolve the Dispute through good faith negotiations between authorised representatives before commencing any formal proceedings.</P>
              </Sub>
              <Sub title="16.2 Mediation">
                <P>If the Dispute is not resolved within fourteen (14) days after notice is given under clause 16.1, either party may refer the Dispute to mediation. Mediation must be conducted by a mediator agreed between the parties, or failing agreement, appointed by the President of the Law Society of the relevant State or Territory. The costs of mediation are to be shared equally between the parties, unless otherwise agreed.</P>
              </Sub>
              <Sub title="16.3 Urgent Relief">
                <P>Nothing in this section prevents either party from seeking urgent interlocutory or injunctive relief where necessary to protect its rights, including in relation to unpaid fees, confidentiality, or misuse of information.</P>
              </Sub>
              <Sub title="16.4 Governing Law and Jurisdiction">
                <P>This MOU is governed by and construed in accordance with the laws of the <strong>State of New South Wales</strong>, and the parties submit to the non-exclusive jurisdiction of the courts of that State.</P>
              </Sub>
            </Clause>

            <Clause number="17" title="Compliance with Regulatory Frameworks">
              <Sub title="17.1 NDIS Regulatory Compliance">
                <P>Each party acknowledges and agrees that it must comply with all applicable legislation, rules, and standards relating to the National Disability Insurance Scheme, including: the National Disability Insurance Scheme Act 2013 (Cth); the NDIS Practice Standards; and the NDIS Code of Conduct. Nothing in this MOU requires or permits either party to act in a manner inconsistent with those obligations.</P>
              </Sub>
              <Sub title="17.2 Australian Consumer Law (ACCC)">
                <P>Each party must comply with the Australian Consumer Law in connection with all conduct relating to this MOU and the APGP. Neither party may engage in conduct that is misleading or deceptive, or likely to mislead or deceive, including in relation to: referral volumes or placement outcomes; fees, pricing, or payment arrangements; or the nature of the relationship between the parties.</P>
              </Sub>
              <Sub title="17.3 No Improper Inducements or Benefits">
                <P>The parties acknowledge that all fees payable under this MOU are commercial business-to-business fees paid by the Accommodation Provider in consideration of referral, placement facilitation, and vacancy protection services. No fee, benefit, or incentive under this MOU is intended to improperly influence a Participant's decision-making or restrict Participant choice and control. Nothing in this MOU constitutes a prohibited inducement, kickback, or benefit under any applicable regulatory framework.</P>
              </Sub>
              <Sub title="17.4 Ethical Conduct">
                <P>Each party agrees to conduct itself ethically and professionally in connection with this MOU, including by: acting honestly and transparently; avoiding conflicts of interest; promptly addressing any regulatory or compliance concerns; and cooperating with reasonable compliance-related requests made by the other party.</P>
              </Sub>
              <Sub title="17.5 Regulatory Engagement">
                <P>Each party remains responsible for its own dealings with regulators and for responding to any regulatory inquiries relating to its own operations. Where a regulatory inquiry relates to matters arising under this MOU, the parties must, to the extent permitted by law, cooperate reasonably and in good faith.</P>
              </Sub>
            </Clause>

            <Clause number="18" title="General Provisions">
              <Sub title="18.1 Assignment">
                <P>The Accommodation Provider must not assign, novate, or otherwise transfer any of its rights or obligations under this MOU without the prior written consent of Ausnew, which must not be unreasonably withheld. Ausnew may assign or transfer its rights and obligations under this MOU to a related entity or as part of a corporate restructure or sale of business by giving written notice to the Accommodation Provider.</P>
              </Sub>
              <Sub title="18.2 Waiver">
                <P>A waiver of any right under this MOU is effective only if given in writing. A failure or delay by either party to exercise any right does not operate as a waiver of that right. A single or partial exercise of a right does not prevent any further exercise of that right.</P>
              </Sub>
              <Sub title="18.3 Severability">
                <P>If any provision of this MOU is held to be invalid, illegal, or unenforceable, that provision is severed to the extent of the invalidity without affecting the validity or enforceability of the remaining provisions.</P>
              </Sub>
              <Sub title="18.4 Amendments">
                <P>This MOU may be amended only by a written document signed by authorised representatives of both parties.</P>
              </Sub>
              <Sub title="18.5 Entire Agreement">
                <P>This MOU constitutes the entire agreement between the parties in relation to the subject matter and supersedes all prior negotiations, representations, or agreements, whether written or oral.</P>
              </Sub>
              <Sub title="18.6 Counterparts and Electronic Execution">
                <P>This MOU may be executed in counterparts, each of which constitutes an original, and together they form one instrument. Execution by electronic means (including electronic signature platforms) is valid and binding.</P>
              </Sub>
              <Sub title="18.7 Notices">
                <P>Any notice under this MOU must be in writing and may be given by email or other agreed electronic means. A notice is deemed received when it is sent, unless the sender receives an automated message indicating that delivery has failed.</P>
              </Sub>
            </Clause>

          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>© 2026 Ausnew Support Services Pty Ltd · ABN: 31 620 493 941 · All rights reserved</p>
            <p className="mt-1">These Terms of Service are available at <a href="https://ausnewdisability.com/apgp-terms-of-service" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">ausnewdisability.com/apgp-terms-of-service</a></p>
          </div>

          {/* CTA */}
          <div className="mt-10 bg-teal-light rounded-2xl p-8 text-center border border-teal/20">
            <h3 className="text-xl font-bold text-navy font-heading mb-3">Join the Accommodation Provider Growth Program</h3>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              To join the APGP or request a tailored proposal, register your organisation for free. Our team will contact you to discuss your placement requirements.
            </p>
            <Link href="/provider/register">
              <Button className="bg-teal hover:bg-teal-600 text-white font-semibold px-8">
                Register Free — No Cost <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
