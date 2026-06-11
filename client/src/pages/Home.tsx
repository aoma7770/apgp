import { Link } from "wouter";
import { ArrowRight, Building2, TrendingUp, Shield, CheckCircle2, Users, Star, Zap, DollarSign, XCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import { motion } from "framer-motion";
import Animate from "@/components/Animate";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-home-UrsEnEjTwniUeLFyWQ3XFG.webp";
const DFY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-dfy-X3AUdhxXRzirRKHUoyhVjv.webp";
const ACCOMMODATION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-accommodation-drDCRERqX3KVFHXAG7Ad66.webp";

function RegisterButton({ label = "Register Now — Free", size = "lg", className = "" }: { label?: string; size?: "sm" | "lg" | "default"; className?: string }) {
  return (
    <Link href="/provider/register">
      <Button size={size} className={`bg-teal hover:bg-teal-600 text-white font-semibold ${className}`}>
        {label} <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Link>
  );
}

const stats = [
  { value: "$0", label: "Upfront cost to start" },
  { value: "2", label: "Partnership pathways" },
  { value: "100%", label: "Results-based fees" },
  { value: "End-to-end", label: "Intake management" },
];

const whatApgpEnables = [
  "Maintain stable occupancy",
  "Reduce vacancy downtime",
  "Remove marketing and recruitment overhead",
  "Improve participant matching quality",
  "Focus on delivering exceptional in-home supports",
];

const pathwayCards = [
  {
    badge: "Pathway 1",
    title: "Joint Venture Partnership",
    subtitle: "Shared Supports Model",
    features: [
      "Fully managed intake process",
      "Participant matched to your property",
      "Community access supports by Ausnew",
      "No placement fee",
      "Collaborative long-term support model",
    ],
    href: "/pathways",
    highlight: false,
  },
  {
    badge: "Pathway 2",
    title: "Referral Partnership",
    subtitle: "Success-Based Placement Fee — Quoted Per Lead",
    features: [
      "Pay only when participant moves in",
      "Marketing and lead generation included",
      "Suitability assessment and matching",
      "Ongoing matching and vacancy support",
      "CRM maintenance of your portfolio",
    ],
    href: "/pathways",
    highlight: true,
  },
];

const dfy_pain = [
  { bad: "Paying for ads with no guaranteed placements", good: "Pay only when a participant moves in" },
  { bad: "Hours spent on unqualified enquiries", good: "Every participant is pre-screened and matched" },
  { bad: "Rooms sitting vacant for months", good: "Active matching begins immediately" },
];

const dfy_costs = [
  { label: "Google / Meta Ads", cost: "$2,000–$8,000/mo" },
  { label: "Marketing agency retainer", cost: "$3,000–$10,000/mo" },
  { label: "Intake coordinator salary", cost: "$65,000–$85,000/yr" },
  { label: "Referral agency fees", cost: "$1,500–$5,000/placement" },
  { label: "Listing platform subscriptions", cost: "$500–$2,400/yr" },
];

const sampleLeads = [
  { type: "SDA", dwelling: "House", timeline: "Immediately", state: "NSW", requester: "Support coordinator" },
  { type: "SIL", dwelling: "Apartment", timeline: "Within 30 days", state: "VIC", requester: "Family member / carer" },
  { type: "SDA", dwelling: "Group home", timeline: "Within 60 days", state: "QLD", requester: "Support coordinator" },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Modern disability-accessible accommodation with support worker and resident"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay: stronger on left for text contrast, fades to transparent on right so photo is vivid */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/50 via-navy/20 to-transparent" />
        </div>

        <div className="container relative z-10 py-20 lg:py-32">
          {/* Text panel — highly transparent, left half only */}
          <div className="max-w-xl bg-black/30 backdrop-blur-sm rounded-3xl p-7 lg:p-10 border border-white/15 shadow-2xl">
            <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal/40 rounded-full px-4 py-1.5 text-sm text-teal-300 font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Accommodation Provider Growth Program
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight font-heading mb-6 text-white drop-shadow-md">
              Disability Accommodation{" "}
              <span className="text-teal-300">Provider Growth</span>{" "}
              Program
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 mb-8 max-w-xl leading-relaxed drop-shadow">
              Partnership pathways that deliver{" "}
              <strong className="text-white">real occupancy</strong>,{" "}
              <strong className="text-white">real stability</strong>, and{" "}
              <strong className="text-white">real growth</strong> — with zero financial risk to providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <RegisterButton label="Register Now — Free" size="lg" className="px-8 shadow-xl shadow-teal/30" />
              <Link href="/done-for-you">
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/15 hover:border-white bg-transparent transition-colors">
                  How It Works <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What is APGP ── */}
      <section className="py-14 bg-white">
        <div className="container">
          <Animate variant="bottom">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-bold text-navy font-heading mb-3">What is the APGP?</h2>
              <p className="text-gray-600">A structured program by Ausnew Support Services that connects SDA and SIL accommodation providers with a consistent, pre-qualified stream of participants.</p>
            </div>
          </Animate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Building2 className="w-6 h-6 text-teal" />, title: "Strategic Partnerships", desc: "Collaborations with leading disability accommodation providers across Australia." },
              { icon: <TrendingUp className="w-6 h-6 text-teal" />, title: "Occupancy Growth", desc: "Proven pathways to increased client occupancy rates through professional matching." },
              { icon: <Shield className="w-6 h-6 text-teal" />, title: "Sustainable Stability", desc: "Building long-term stability through quality occupancy outcomes and vacancy protection." },
            ].map((card, i) => (
              <Animate key={card.title} variant={i === 0 ? "left" : i === 1 ? "bottom" : "right"} delay={i * 0.08}>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center mb-4">{card.icon}</div>
                  <h3 className="font-bold text-navy font-heading mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </Animate>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Animate key={stat.label} variant="bottom" delay={i * 0.06}>
                <div className="bg-navy rounded-2xl p-6 text-center text-white">
                  <p className="text-3xl font-extrabold text-teal-300 font-heading">{stat.value}</p>
                  <p className="text-xs text-gray-300 mt-1">{stat.label}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Done For You teaser ── */}
      <section className="py-16 lg:py-24 bg-navy text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src={DFY_IMG} alt="Business meeting showing occupancy data and property management charts" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Animate variant="left">
              <div>
                <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Done For You · Pay Per Result</div>
                <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-6">
                  Stop Paying for Ads.<br />
                  <span className="text-teal-300">Start Paying for Results.</span>
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  The average SDA/SIL provider spends <strong className="text-white">$30,000–$80,000+ per year</strong> on ads, agency retainers, and intake staff — with no guarantee of a single placement.
                </p>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  APGP flips the model entirely. You tell us your vacancy. We find the participant, manage the full intake, and support the move-in. <strong className="text-white">You pay nothing until they walk through the door.</strong>
                </p>
                <div className="space-y-3 mb-8">
                  {dfy_pain.map((item) => (
                    <div key={item.bad} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-sm line-through">{item.bad}</span>
                    </div>
                  ))}
                  {dfy_pain.map((item) => (
                    <div key={item.good} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                      <span className="text-gray-200 text-sm">{item.good}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/done-for-you">
                    <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                      See the Full Breakdown <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <RegisterButton label="Register Free" size="default" />
                </div>
              </div>
            </Animate>

            <Animate variant="right" delay={0.1}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="font-bold text-white font-heading mb-4 text-sm uppercase tracking-widest">What Providers Typically Spend</h3>
                <div className="space-y-3">
                  {dfy_costs.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <span className="text-gray-300 text-sm">{item.label}</span>
                      <span className="text-red-300 font-semibold text-sm shrink-0">{item.cost}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/20 pt-3 flex items-center justify-between gap-4">
                    <span className="text-teal-300 font-bold">With APGP</span>
                    <span className="text-teal-300 font-extrabold text-lg">$0 until move-in</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">One fixed fee per successful placement. That's it.</p>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* ── Partnership Pathways ── */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <Animate variant="bottom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">Two Partnership Pathways — One Reliable Outcome</h2>
              <p className="text-gray-600">A predictable stream of participants professionally screened, intake-ready, and matched to your properties.</p>
            </div>
          </Animate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pathwayCards.map((card, i) => (
              <Animate key={card.title} variant={i === 0 ? "left" : "right"} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 border h-full flex flex-col ${card.highlight ? "bg-navy text-white border-navy" : "bg-white border-gray-100 shadow-sm"}`}>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${card.highlight ? "text-teal-300" : "text-teal"}`}>{card.badge}</div>
                  <h3 className={`text-xl font-bold font-heading mb-1 ${card.highlight ? "text-white" : "text-navy"}`}>{card.title}</h3>
                  <p className={`text-sm mb-5 ${card.highlight ? "text-gray-300" : "text-gray-500"}`}>{card.subtitle}</p>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${card.highlight ? "text-teal-300" : "text-teal"}`} />
                        <span className={card.highlight ? "text-gray-200" : "text-gray-700"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={card.href}>
                    <Button variant={card.highlight ? "default" : "outline"} className={card.highlight ? "bg-teal hover:bg-teal-600 text-white w-full" : "border-navy text-navy hover:bg-navy hover:text-white w-full"}>
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── What APGP Enables ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Animate variant="left">
              <div>
                <div className="text-teal text-sm font-semibold uppercase tracking-widest mb-4">Built for SDA & SIL Providers</div>
                <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-6">What APGP Enables for Providers</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Across the country, providers face a clear challenge: high-quality SDA and SIL homes sitting vacant, unpredictable referral flow, and the ongoing cost of maintaining empty rooms. APGP changes that.
                </p>
                <ul className="space-y-3 mb-8">
                  {whatApgpEnables.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <RegisterButton label="Register Now — Free" size="lg" className="px-8" />
              </div>
            </Animate>
            <Animate variant="right" delay={0.15}>
              <div className="relative">
                <img
                  src={ACCOMMODATION_IMG}
                  alt="Modern SDA disability accommodation homes in Australian suburb"
                  className="w-full h-80 lg:h-[460px] object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-navy text-white rounded-2xl p-5 shadow-xl">
                  <p className="text-3xl font-extrabold text-teal-300 font-heading">$0</p>
                  <p className="text-xs text-gray-300 mt-1">until move-in</p>
                </div>
                <div className="absolute -top-6 -right-6 bg-teal text-white rounded-2xl p-5 shadow-xl">
                  <p className="text-3xl font-extrabold font-heading">100%</p>
                  <p className="text-xs text-white/80 mt-1">results-based</p>
                </div>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* ── Live Enquiries teaser ── */}
      <section className="py-16 lg:py-20 bg-white border-t border-gray-100">
        <div className="container">
          <Animate variant="bottom">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Feed — Updated in Real Time
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">
                Participant Enquiries Are Coming In Now
              </h2>
              <p className="text-gray-600 text-lg">
                Registered APGP providers get exclusive access to a live feed of NDIS accommodation enquiries from our participant pipeline. Create a free account to view and action real leads.
              </p>
            </div>
          </Animate>

          {/* Blurred sample lead cards with lock overlay */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pointer-events-none select-none">
              {sampleLeads.map((sample, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm" style={{ filter: 'blur(3px)', opacity: 0.75 }}>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" /> NEW
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-navy text-white">{sample.type}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">NDIS Registered</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[['Dwelling', sample.dwelling], ['Timeline', sample.timeline], ['State', sample.state], ['Submitted by', sample.requester]].map(([label, val]) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-navy">{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-9 bg-teal rounded-xl" />
                </div>
              ))}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-8 text-center shadow-2xl border border-gray-100 max-w-sm mx-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-teal" />
                </div>
                <h3 className="font-bold text-navy font-heading text-lg mb-2">Register to View Live Enquiries</h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  Create a free provider account to access the full live feed of NDIS participant accommodation enquiries.
                </p>
                <RegisterButton label="Register Free — Unlock Access" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EOI CTA ── */}
      <section className="gradient-teal py-16 text-white text-center">
        <div className="container max-w-2xl">
          <Animate variant="bottom">
            <h2 className="text-3xl font-bold font-heading mb-4">Your Next Participant Is Waiting.</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join APGP and replace ad spend with a results-based partnership. You list the vacancy. We do the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <RegisterButton label="Register Free" size="lg" className="bg-navy hover:bg-navy-dark px-10" />
              <Link href="/done-for-you">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                  How It Works
                </Button>
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </PublicLayout>
  );
}
