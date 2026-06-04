import { Link } from "wouter";
import { ArrowRight, Building2, TrendingUp, Shield, CheckCircle2, Users, Star, Zap, DollarSign, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import JotformModal from "@/components/JotformModal";
import { motion } from "framer-motion";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-home-UrsEnEjTwniUeLFyWQ3XFG.webp";
const ACCOMMODATION_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-accommodation-drDCRERqX3KVFHXAG7Ad66.webp";
const DFY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663486953469/VXENecN32kGDVq7itT27ZC/apgp-hero-dfy-X3AUdhxXRzirRKHUoyhVjv.webp";

// Directional animation variants
const fromLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } };
const fromRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } };
const fromBottom = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0 } };
const scaleIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } };

function Animate({
  children,
  variant = "bottom",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  variant?: "left" | "right" | "bottom" | "scale";
  delay?: number;
  className?: string;
}) {
  const variants = { left: fromLeft, right: fromRight, bottom: fromBottom, scale: scaleIn };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants[variant]}
      transition={{ delay, duration: 0.55 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <PublicLayout>
      {/* ── Hero with background image ── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background image */}
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
              <JotformModal
                label="Register Now — Free"
                size="lg"
                buttonClassName="px-8 shadow-xl shadow-teal/30"
              />
              <Link href="/done-for-you">
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/15 hover:border-white bg-transparent transition-colors">
                  How It Works <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }} />
      </section>

      {/* ── What is APGP ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <Animate variant="bottom">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">What is the APGP?</h2>
              <p className="text-gray-600 text-lg">
                A structured program by Ausnew Support Services that connects SDA and SIL accommodation providers with a consistent, pre-qualified stream of participants.
              </p>
            </div>
          </Animate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="w-7 h-7 text-teal" />, title: "Strategic Partnerships", desc: "Collaborations with leading disability accommodation providers across Australia.", delay: 0, variant: "left" as const },
              { icon: <TrendingUp className="w-7 h-7 text-teal" />, title: "Occupancy Growth", desc: "Proven pathways to increased client occupancy rates through professional matching.", delay: 0.1, variant: "bottom" as const },
              { icon: <Shield className="w-7 h-7 text-teal" />, title: "Sustainable Stability", desc: "Building long-term stability through quality occupancy outcomes and vacancy protection.", delay: 0.2, variant: "right" as const },
            ].map((item) => (
              <Animate key={item.title} variant={item.variant} delay={item.delay}>
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow text-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mx-auto mb-5">{item.icon}</div>
                  <h3 className="text-lg font-bold text-navy font-heading mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats banner ── */}
      <section className="bg-teal-light py-12">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "$0", label: "Upfront cost to start" },
              { value: "2", label: "Partnership pathways" },
              { value: "100%", label: "Results-based fees" },
              { value: "End-to-end", label: "Intake management" },
            ].map((stat, i) => (
              <Animate key={stat.label} variant="bottom" delay={i * 0.07}>
                <div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-navy font-heading">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
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
            <Animate variant="left" delay={0}>
              <div>
                <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal/30 rounded-full px-4 py-1.5 text-sm text-teal-300 mb-6">
                  <Zap className="w-3.5 h-3.5" />
                  Done For You · Pay Per Result
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold font-heading mb-6">
                  Stop Paying for Ads.<br />
                  <span className="text-teal-300">Start Paying for Results.</span>
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  The average SDA/SIL provider spends <strong className="text-white">$30,000–$80,000+ per year</strong> on ads, agency retainers, and intake staff — with no guarantee of a single placement.
                </p>
                <p className="text-gray-300 leading-relaxed mb-8">
                  APGP flips the model entirely. You tell us your vacancy. We find the participant, manage the full intake, and support the move-in. <strong className="text-white">You pay nothing until they walk through the door.</strong>
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    { bad: "Paying for ads with no guaranteed placements", good: "Pay only when a participant moves in" },
                    { bad: "Hours spent on unqualified enquiries", good: "Every participant is pre-screened and matched" },
                    { bad: "Rooms sitting vacant for months", good: "Active matching begins immediately" },
                  ].map((row) => (
                    <div key={row.bad} className="grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 bg-white/5 rounded-xl p-3">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-400">{row.bad}</span>
                      </div>
                      <div className="flex items-start gap-2 bg-teal/10 rounded-xl p-3">
                        <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-200 font-medium">{row.good}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/done-for-you">
                    <Button size="lg" className="bg-teal hover:bg-teal-500 text-white font-semibold">
                      See the Full Breakdown <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <JotformModal label="Register Free" size="lg" buttonClassName="bg-white/10 hover:bg-white/20 border border-white/20" />
                </div>
              </div>
            </Animate>

            <Animate variant="right" delay={0.15}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="font-bold font-heading text-lg mb-6 text-white">What Providers Typically Spend</h3>
                <div className="space-y-4">
                  {[
                    { label: "Google / Meta Ads", cost: "$2,000–$8,000/mo" },
                    { label: "Marketing agency retainer", cost: "$3,000–$10,000/mo" },
                    { label: "Intake coordinator salary", cost: "$65,000–$85,000/yr" },
                    { label: "Referral agency fees", cost: "$1,500–$5,000/placement" },
                    { label: "Listing platform subscriptions", cost: "$500–$2,400/yr" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-300">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold text-red-400 shrink-0">{item.cost}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-teal/20 border border-teal/30 rounded-2xl p-5 text-center">
                  <p className="text-xs text-teal-300 font-semibold uppercase tracking-widest mb-1">With APGP</p>
                  <p className="text-2xl font-extrabold text-white font-heading">$0 until move-in</p>
                  <p className="text-xs text-gray-400 mt-1">One fixed fee per successful placement. That's it.</p>
                </div>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* ── Partnership Pathways ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <Animate variant="bottom">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">
                Two Partnership Pathways — One Reliable Outcome
              </h2>
              <p className="text-gray-600 text-lg">
                A predictable stream of participants professionally screened, intake-ready, and matched to your properties.
              </p>
            </div>
          </Animate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Animate variant="left" delay={0}>
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="bg-navy p-8 text-white">
                  <div className="text-xs font-semibold text-teal-300 uppercase tracking-widest mb-2">Pathway 1</div>
                  <h3 className="text-2xl font-bold font-heading mb-2">Joint Venture Partnership</h3>
                  <p className="text-gray-300 text-sm">Shared Supports Model</p>
                </div>
                <div className="p-8 bg-white flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {["Fully managed intake process", "Participant matched to your property", "Community access supports by Ausnew", "No placement fee", "Collaborative long-term support model"].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-teal mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/pathways">
                    <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy hover:text-white transition-colors">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Animate>
            <Animate variant="right" delay={0.1}>
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="bg-teal p-8 text-white">
                  <div className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-2">Pathway 2</div>
                  <h3 className="text-2xl font-bold font-heading mb-2">Referral Partnership</h3>
                  <p className="text-white/80 text-sm">Success-Based Placement Fee + Weekly Subscription</p>
                </div>
                <div className="p-8 bg-white flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {["Pay only when participant moves in", "Marketing and lead generation included", "Suitability assessment and matching", "Vacancy Protection Plan available", "CRM maintenance of your portfolio"].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-teal mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/pathways">
                    <Button className="w-full bg-teal hover:bg-teal-600 text-white transition-colors">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* ── Accommodation image section ── */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Animate variant="left" delay={0}>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-6">What APGP Enables for Providers</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Across the country, providers face a clear challenge: high-quality SDA and SIL homes sitting vacant, unpredictable referral flow, and the ongoing cost of maintaining empty rooms. APGP changes that.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    { icon: <Building2 className="w-5 h-5" />, text: "Maintain stable occupancy" },
                    { icon: <TrendingUp className="w-5 h-5" />, text: "Reduce vacancy downtime" },
                    { icon: <Star className="w-5 h-5" />, text: "Remove marketing and recruitment overhead" },
                    { icon: <Users className="w-5 h-5" />, text: "Improve participant matching quality" },
                    { icon: <Shield className="w-5 h-5" />, text: "Focus on delivering exceptional in-home supports" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center text-teal shrink-0">{item.icon}</div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <JotformModal label="Register Now — Free" size="lg" buttonClassName="px-8" />
              </div>
            </Animate>
            <Animate variant="right" delay={0.15}>
              <div className="relative">
                <img
                  src={ACCOMMODATION_IMG}
                  alt="Modern SDA disability accommodation homes in Australian suburb"
                  className="w-full h-80 lg:h-[460px] object-cover rounded-3xl shadow-2xl"
                />
                {/* Floating stat card */}
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

      {/* ── EOI CTA ── */}
      <section className="gradient-teal py-16 text-white text-center">
        <div className="container max-w-2xl">
          <Animate variant="bottom">
            <h2 className="text-3xl font-bold font-heading mb-4">Your Next Participant Is Waiting.</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join APGP and replace ad spend with a results-based partnership. You list the vacancy. We do the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JotformModal label="Register Free" size="lg" buttonClassName="bg-navy hover:bg-navy-dark px-10" />
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
