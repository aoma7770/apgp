import { CheckCircle2, XCircle, ArrowRight, DollarSign, Clock, Users, Megaphone, Search, FileCheck, Home, Handshake, TrendingDown, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import JotformModal from "@/components/JotformModal";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={{ delay, duration: 0.55 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const processSteps = [
  {
    number: "01",
    icon: <Home className="w-6 h-6" />,
    title: "Register Free and Access the Platform",
    desc: "Create your free APGP provider account in minutes. Once logged in, you immediately gain access to the live participant enquiries feed and your provider dashboard.",
    highlight: "No commitment. No upfront cost. Just register.",
  },
  {
    number: "02",
    icon: <Search className="w-6 h-6" />,
    title: "Two Ways to Find Your Next Participant",
    desc: "Option A: Tell us your vacancies and our team actively matches participants from our pipeline to your specific properties. Option B: Browse the live participant enquiries feed and select the enquiries that match your available properties — participants choose the provider that best meets their needs.",
    highlight: "You choose how involved you want to be.",
  },
  {
    number: "03",
    icon: <FileCheck className="w-6 h-6" />,
    title: "We Handle the Full Intake Process",
    desc: "Discovery calls, suitability assessments, documentation collection, NDIS plan verification, property inspections — we coordinate every step of the intake journey on your behalf.",
    highlight: "Your team stays focused on delivering great supports.",
  },
  {
    number: "04",
    icon: <Handshake className="w-6 h-6" />,
    title: "We Support the Move-In",
    desc: "We stay engaged through the transition, supporting the participant and your team through onboarding, tenancy setup, and the first weeks of placement to ensure a stable start.",
    highlight: "We don't disappear after the referral.",
  },
  {
    number: "05",
    icon: <DollarSign className="w-6 h-6" />,
    title: "You Pay Only When They Move In",
    desc: "Our fee is triggered only when the participant has completed intake and physically moved into your accommodation. Not when we find them. Not when they visit. Only when they're in.",
    highlight: "Zero risk. 100% results-based.",
  },
];

const traditionalCosts = [
  { label: "Google / Meta Ads (monthly)", low: "$2,000", high: "$8,000+", note: "Ongoing spend with no guaranteed results" },
  { label: "Disability marketing agency retainer", low: "$3,000", high: "$10,000+", note: "Monthly fee regardless of placements" },
  { label: "In-house intake coordinator salary", low: "$65,000", high: "$85,000+", note: "Annual cost, plus super, leave, and training" },
  { label: "Support coordinator referral fees", low: "$1,500", high: "$5,000+", note: "Per referral, often with no move-in guarantee" },
  { label: "Housing Hub / Go-Nest listing fees", low: "$500", high: "$2,400+", note: "Annual subscription, visibility not guaranteed" },
  { label: "Time cost of unqualified enquiries", low: "10–20 hrs", high: "per vacancy", note: "Staff hours spent on enquiries that never convert" },
];

const comparisons = [
  {
    category: "Upfront cost",
    traditional: "Thousands in ads, retainers, and staff before a single participant is placed",
    apgp: "Zero. No upfront spend. No retainer. No subscription required to start.",
    apgpWins: true,
  },
  {
    category: "Risk",
    traditional: "You carry all the financial risk — ads may not convert, agencies may not deliver",
    apgp: "We carry the risk. You only pay when a participant moves in.",
    apgpWins: true,
  },
  {
    category: "Your time investment",
    traditional: "Hours per week managing ads, responding to unqualified enquiries, coordinating intake",
    apgp: "Tell us your vacancy once. We handle everything from search to move-in.",
    apgpWins: true,
  },
  {
    category: "Lead quality",
    traditional: "Mixed — many enquiries from unsuitable participants, wrong funding, wrong location",
    apgp: "Every participant is pre-screened, NDIS-funded, and matched to your specific property.",
    apgpWins: true,
  },
  {
    category: "Intake support",
    traditional: "You manage documentation, assessments, inspections, and onboarding internally",
    apgp: "We coordinate the full intake process — documentation, assessments, inspections, and move-in support.",
    apgpWins: true,
  },
  {
    category: "Vacancy downtime",
    traditional: "Weeks to months of vacancy while marketing campaigns build momentum",
    apgp: "Active matching begins immediately. Replacement search included if a participant exits.",
    apgpWins: true,
  },
];

const painPoints = [
  { icon: <TrendingDown className="w-5 h-5 text-red-400" />, text: "Spending thousands on ads with no guaranteed placements" },
  { icon: <Clock className="w-5 h-5 text-red-400" />, text: "Wasting hours on enquiries from unsuitable participants" },
  { icon: <AlertTriangle className="w-5 h-5 text-red-400" />, text: "Rooms sitting vacant for weeks or months at a time" },
  { icon: <Users className="w-5 h-5 text-red-400" />, text: "Paying intake coordinators whether they fill vacancies or not" },
  { icon: <Megaphone className="w-5 h-5 text-red-400" />, text: "Running marketing campaigns with no disability sector expertise" },
  { icon: <DollarSign className="w-5 h-5 text-red-400" />, text: "Paying agency retainers with no performance accountability" },
];

export default function DoneForYou() {
  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-teal blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp delay={0}>
              <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal/30 rounded-full px-4 py-1.5 text-sm text-teal-300 mb-6">
                <Zap className="w-3.5 h-3.5" />
                Done For You · Pay Per Result · Zero Upfront Cost
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight font-heading mb-6">
                Stop Paying for Ads.<br />
                <span className="text-teal-300">Start Paying for Results.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto leading-relaxed">
                We find the participant. We handle the intake. We support the move-in.
                <strong className="text-white"> You only pay when they walk through the door.</strong>
              </p>
              <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
                The complete, done-for-you occupancy solution for SDA and SIL providers — built around one simple principle: if we don't deliver, you don't pay.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <JotformModal
                  label="Get Started — It's Free"
                  size="lg"
                  buttonClassName="px-10 shadow-xl shadow-teal/20"
                />
                <a href="#how-it-works">
                  <button className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors text-sm font-medium">
                    See How It Works <ArrowRight className="w-4 h-4" />
                  </button>
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
        {/* Stat strip */}
        <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="container py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { value: "$0", label: "Upfront cost to start" },
                { value: "100%", label: "Results-based fees" },
                { value: "End-to-end", label: "Intake management" },
                { value: "You list it", label: "We fill it" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl lg:text-3xl font-extrabold text-teal-300 font-heading">{s.value}</div>
                  <div className="text-xs text-gray-300 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-16 bg-white" style={{ clipPath: "ellipse(55% 100% at 50% 100%)", marginTop: "-1px" }} />
      </section>

      {/* ── Pain points ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-4xl">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">
                Sound Familiar?
              </h2>
              <p className="text-gray-600 text-lg">
                Most SDA and SIL providers are stuck in the same costly, time-consuming cycle — and it doesn't have to be this way.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPoints.map((p, i) => (
              <FadeUp key={p.text} delay={i * 0.06}>
                <div className="flex items-start gap-4 bg-red-50 border border-red-100 rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                    {p.icon}
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-snug">{p.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.2}>
            <div className="mt-10 bg-navy rounded-2xl p-8 text-white text-center">
              <p className="text-xl font-bold font-heading mb-2">
                The average SDA/SIL provider spends{" "}
                <span className="text-teal-300">$30,000–$80,000+ per year</span>{" "}
                trying to fill vacancies.
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Between ads, agency fees, intake staff, and listing subscriptions — most of it with no performance guarantee.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── The APGP difference ── */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-4xl">
          <FadeUp>
            <div className="text-center mb-12">
              <div className="inline-block bg-teal text-white text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">The APGP Difference</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">
                One Simple Rule: <span className="text-teal">No Result, No Fee.</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We've built a complete, end-to-end occupancy system for SDA and SIL providers. You tell us your vacancy. We do everything else — and we only invoice you when the participant moves in.
              </p>
            </div>
          </FadeUp>

          {/* Big statement cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <DollarSign className="w-8 h-8 text-teal" />,
                title: "Pay Per Result",
                desc: "Our fee is triggered only when a participant completes intake and moves into your property. Not before. Not during. Only after.",
                bg: "bg-white",
              },
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                title: "Done For You",
                desc: "We handle lead generation, screening, matching, documentation, inspections, and onboarding. Your team stays focused on care delivery.",
                bg: "bg-navy text-white",
                descColor: "text-gray-300",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-teal" />,
                title: "Zero Upfront Cost",
                desc: "No retainer. No subscription. No ad spend. Register for free, share your vacancy, and we get to work immediately.",
                bg: "bg-white",
              },
            ].map((card) => (
              <FadeUp key={card.title}>
                <div className={`rounded-2xl p-8 h-full border border-gray-100 shadow-sm ${card.bg}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${card.bg === "bg-navy text-white" ? "bg-white/10" : "bg-teal-light"}`}>
                    {card.icon}
                  </div>
                  <h3 className={`text-xl font-bold font-heading mb-3 ${card.bg === "bg-navy text-white" ? "text-white" : "text-navy"}`}>{card.title}</h3>
                  <p className={`text-sm leading-relaxed ${card.descColor ?? "text-gray-600"}`}>{card.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-white scroll-mt-20">
        <div className="container max-w-4xl">
          <FadeUp>
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg">
                From vacancy to move-in — we manage every step. Here's exactly what happens after you register.
              </p>
            </div>
          </FadeUp>

          <div className="space-y-6">
            {processSteps.map((step, i) => (
              <FadeUp key={step.number} delay={i * 0.08}>
                <div className="flex gap-6 items-start bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-shadow">
                  {/* Step number */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-teal-300 font-extrabold font-heading text-lg">
                      {step.number}
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 rounded-full" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center text-teal shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="font-bold text-navy font-heading text-lg">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{step.desc}</p>
                    <div className="inline-flex items-center gap-2 bg-teal-light text-teal text-xs font-semibold px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {step.highlight}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Final CTA after process */}
          <FadeUp delay={0.2}>
            <div className="mt-10 text-center">
              <JotformModal
                label="Register Your Vacancy — Free"
                size="lg"
                buttonClassName="px-12 shadow-lg"
              />
              <p className="text-xs text-gray-400 mt-3">No commitment. No upfront cost. Our team will be in touch within 2 business days.</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Cost comparison table ── */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-5xl">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">
                What Providers Typically Spend to Fill One Vacancy
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Before APGP, providers absorb these costs every time a room sits empty — with no guarantee of a result.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="px-6 py-4 text-left font-semibold">Traditional Cost Item</th>
                    <th className="px-6 py-4 text-center font-semibold">Typical Range</th>
                    <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">The Problem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {traditionalCosts.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 font-medium text-navy">{row.label}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-red-600 font-bold">{row.low}</span>
                        <span className="text-gray-400 mx-1">–</span>
                        <span className="text-red-600 font-bold">{row.high}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs hidden md:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-red-50 border-t-2 border-red-200">
                    <td className="px-6 py-5 font-bold text-red-700">Estimated Annual Total</td>
                    <td className="px-6 py-5 text-center font-extrabold text-red-700 text-base">$30,000 – $80,000+</td>
                    <td className="px-6 py-5 text-red-600 text-xs hidden md:table-cell font-medium">With no guarantee of occupancy outcomes</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </FadeUp>

          {/* APGP vs Traditional */}
          <FadeUp delay={0.15}>
            <div className="bg-teal-light border border-teal/20 rounded-2xl p-8 text-center">
              <div className="text-teal font-bold text-sm uppercase tracking-widest mb-3">With APGP</div>
              <p className="text-3xl font-extrabold text-navy font-heading mb-2">
                $0 until the participant moves in.
              </p>
              <p className="text-gray-600 text-sm max-w-xl mx-auto">
                One fixed fee per successful placement — covering everything from lead generation to move-in support. No retainers. No ad spend. No wasted hours on unqualified enquiries.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Side-by-side comparison ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-5xl">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">
                APGP vs. Doing It Yourself
              </h2>
              <p className="text-gray-600 text-lg">
                A direct comparison across every dimension that matters to SDA and SIL providers.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="bg-gray-50 px-6 py-4 text-left font-semibold text-navy w-1/4">Category</th>
                    <th className="bg-red-50 px-6 py-4 text-center font-semibold text-red-700">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Traditional Approach
                      </div>
                    </th>
                    <th className="bg-teal-light px-6 py-4 text-center font-semibold text-teal">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        APGP Done For You
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisons.map((row, i) => (
                    <tr key={row.category} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                      <td className="px-6 py-5 font-semibold text-navy text-xs uppercase tracking-wide">{row.category}</td>
                      <td className="px-6 py-5 text-gray-600 text-xs leading-relaxed">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          {row.traditional}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-700 text-xs leading-relaxed">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                          <strong>{row.apgp}</strong>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Who this is for ── */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-4xl">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">
                Built for SDA and SIL Providers Who Are Serious About Occupancy
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                APGP is designed for providers who want to stop gambling on marketing and start getting predictable, quality placements.
              </p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "You have SDA or SIL vacancies", desc: "Whether you have one room or a full portfolio, APGP works at any scale. We match participants to your specific property type, location, and support profile." },
              { title: "You're tired of paying for ads with no results", desc: "If you've spent money on Google Ads, Facebook, or disability marketing agencies and seen little return, APGP eliminates that risk entirely." },
              { title: "You want to focus on care, not sales", desc: "Your expertise is delivering exceptional in-home supports — not running marketing campaigns. APGP lets you stay in your lane." },
              { title: "You want a long-term occupancy partner", desc: "APGP isn't a one-off referral. We provide ongoing vacancy management, replacement search, and a continuous pipeline of pre-qualified participants." },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.07}>
                <div className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-navy font-heading mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="gradient-hero text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container max-w-3xl text-center relative">
          <FadeUp>
            <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal/30 rounded-full px-4 py-1.5 text-sm text-teal-300 mb-6">
              <Zap className="w-3.5 h-3.5" />
              No upfront cost · No risk · Pay only for results
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">
              Your Next Participant Is Waiting.<br />
              <span className="text-teal-300">Let's Find Them Together.</span>
            </h2>
            <p className="text-gray-200 text-lg mb-4 leading-relaxed">
              Register your vacancy in under 5 minutes. Our team will be in touch within 2 business days to begin the matching process — at absolutely no cost to you until a participant moves in.
            </p>
            <p className="text-gray-300 text-sm mb-10">
              Join SDA and SIL providers across Australia who have replaced ad spend with a results-based partnership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JotformModal
                label="Register Your Vacancy — Free"
                size="lg"
                buttonClassName="px-12 shadow-2xl shadow-teal/30"
              />
            </div>
            <p className="text-xs text-gray-400 mt-6">
              All partnership arrangements are business-to-business and entirely separate from NDIS funding processes.
            </p>
          </FadeUp>
        </div>
      </section>
    </PublicLayout>
  );
}
