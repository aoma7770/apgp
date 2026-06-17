import { CheckCircle2, ArrowRight, DollarSign, Search, FileCheck, Home, Handshake } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Animate from "@/components/Animate";

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
    title: "Share Your Vacancies or Browse the Live Feed",
    desc: "Tell us about your available properties and our team actively matches participants from our pipeline. Or browse the live participant enquiries feed and select the enquiries that match your available properties.",
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

export default function Pathways() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="container max-w-3xl text-center">
          <Animate variant="bottom" delay={0}>
            <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">How It Works</div>
          </Animate>
          <Animate variant="bottom" delay={0.1}>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">
              Referral Partnership — How APGP Works
            </h1>
          </Animate>
          <Animate variant="bottom" delay={0.2}>
            <p className="text-gray-300 text-lg leading-relaxed">
              A success-based placement model. APGP sources, qualifies, and matches participants to your properties. You pay only when a participant moves in.
            </p>
          </Animate>
        </div>
      </section>

      {/* What the placement fee covers */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Pricing card */}
            <Animate variant="left">
              <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-navy font-heading text-lg mb-6">Pricing Structure</h3>
                <div className="space-y-5">
                  {[
                    { label: "Placement Fee (Success-Based)", value: "Quoted per lead — tailored to your region", note: "No payment until the participant completes intake and moves into your accommodation. A quote is issued for each successful placement." },
                    { label: "Lead Generation", value: "Included — no additional cost", note: "APGP sources and qualifies participants from its pipeline at no extra charge." },
                    { label: "Intake Coordination", value: "Included — no additional cost", note: "Documentation, assessments, inspections, and onboarding all managed by APGP." },
                    { label: "Move-In Support", value: "Included — no additional cost", note: "APGP stays engaged through the transition to ensure a stable start." },
                  ].map((row) => (
                    <div key={row.label} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <span className="text-sm font-semibold text-navy">{row.label}</span>
                        <span className="text-sm text-teal font-medium text-right shrink-0">{row.value}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{row.note}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-6 italic">Pricing is per lead and per result — a tailored quote is issued for each successful placement.</p>
              </div>
            </Animate>

            {/* Description */}
            <Animate variant="right">
              <div>
                <div className="inline-block bg-teal text-white text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">Referral Partnership</div>
                <h2 className="text-3xl font-bold text-navy font-heading mb-3">Success-Based Placement Fee — Quoted Per Lead</h2>
                <p className="text-teal font-semibold mb-6">You pay only when a participant moves in.</p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  APGP sources, qualifies, and matches NDIS participants to your available properties. Our team manages the full intake process from first contact through to move-in — so your team can stay focused on delivering exceptional in-home supports.
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
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Once the participant is onboarded, APGP continues to support the relationship — assisting with vacancy management, ongoing matching, and participant retention to help you maintain stable long-term occupancy.
                </p>
                <Link href="/provider/register">
                  <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
                    Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* How It Works — 5 steps */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container max-w-4xl">
          <Animate variant="bottom">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">The Process — Step by Step</h2>
              <p className="text-gray-600 text-lg">From vacancy to move-in — here's exactly what happens after you register.</p>
            </div>
          </Animate>
          <div className="space-y-6">
            {processSteps.map((step, i) => (
              <Animate key={step.number} variant={i % 2 === 0 ? "left" : "right"} delay={i * 0.08}>
                <div className="flex gap-6 items-start bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-teal-300 font-extrabold font-heading text-lg">
                      {step.number}
                    </div>
                    {i < processSteps.length - 1 && <div className="w-0.5 h-6 bg-gray-200 rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center text-teal shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="font-bold text-navy font-heading">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">{step.desc}</p>
                    <p className="text-teal text-xs font-semibold">{step.highlight}</p>
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Fill Your Vacancies?</h2>
          <p className="text-gray-300 mb-8">Register for free and our team will be in touch within 2 business days to begin the matching process — at no cost until a participant moves in.</p>
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
