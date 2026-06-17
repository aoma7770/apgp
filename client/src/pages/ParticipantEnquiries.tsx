import { Link } from "wouter";
import {
  CheckCircle2, Users, Zap, Lock, ArrowRight, Clock, MapPin,
  Tag, Shield, Eye, Handshake, TrendingUp, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import Animate from "@/components/Animate";

const sampleLeads = [
  {
    type: "SDA",
    dwelling: "House",
    timeline: "Immediately",
    state: "NSW",
    requester: "Support coordinator",
    ndis: true,
    careFor: "A client",
    id: "M12-847291",
  },
  {
    type: "SIL",
    dwelling: "Apartment",
    timeline: "Within 30 days",
    state: "VIC",
    requester: "Family member / carer",
    ndis: true,
    careFor: "A loved one",
    id: "M12-613047",
  },
  {
    type: "SDA",
    dwelling: "Group home",
    timeline: "Within 60 days",
    state: "QLD",
    requester: "Support coordinator",
    ndis: true,
    careFor: "A client",
    id: "M12-502836",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: <Bell className="w-6 h-6" />,
    title: "Leads Come In Through Our CRM",
    desc: "Every time a new NDIS participant enquiry is received through our marketing channels, it is automatically fed into the APGP platform in real time — no manual entry, no delays.",
  },
  {
    step: "02",
    icon: <Eye className="w-6 h-6" />,
    title: "Providers See Anonymous Enquiries",
    desc: "Registered APGP providers log in and see a live feed of participant accommodation requests. No personal information is shown — only the accommodation type, dwelling preference, NDIS status, timeline, and state.",
  },
  {
    step: "03",
    icon: <Handshake className="w-6 h-6" />,
    title: "Provider Expresses Interest",
    desc: "If a provider has a suitable property, they click 'I'm Interested' and complete a Referral Agreement and Consent Form directly in the platform. The whole process takes under 2 minutes.",
  },
  {
    step: "04",
    icon: <Users className="w-6 h-6" />,
    title: "Our Team Facilitates the Connection",
    desc: "Once a provider submits their interest, our team reviews the match and contacts both the participant and the provider to progress the placement — managing the full intake process.",
  },
  {
    step: "05",
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Placement Confirmed — Provider Pays",
    desc: "The provider only pays when the participant completes intake and moves into the accommodation. Zero upfront cost. Zero risk. 100% results-based.",
  },
];

const whatYouSee = [
  { label: "Accommodation type", example: "SDA, SIL, STA, MTA" },
  { label: "Dwelling preference", example: "House, Apartment, Group home" },
  { label: "NDIS registration status", example: "Registered, In progress" },
  { label: "Who submitted the request", example: "Support coordinator, Family member" },
  { label: "Move-in timeline", example: "Immediately, Within 30 days" },
  { label: "Preferred state", example: "NSW, VIC, QLD, etc." },
  { label: "Support needs notes", example: "High physical support, 24-hour care" },
  { label: "APGP lead ID", example: "M12-847291" },
];

const whatYouDontSee = [
  "Participant name",
  "Contact details (phone, email, address)",
  "NDIS plan details or funding amounts",
  "Medical or diagnostic information",
  "Any personally identifying information",
];

export default function ParticipantEnquiries() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-teal blur-3xl" />
        </div>
        <div className="container max-w-3xl text-center relative z-10">
          <Animate variant="bottom" delay={0}>
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-1.5 text-sm text-green-300 font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live Feed — Exclusive to Registered Providers
            </div>
          </Animate>
          <Animate variant="bottom" delay={0.1}>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">
              Live Participant Enquiries
            </h1>
          </Animate>
          <Animate variant="bottom" delay={0.2}>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              APGP-registered providers get exclusive access to a real-time feed of NDIS accommodation requests sourced directly from our participant pipeline. Every enquiry is anonymous, pre-qualified, and ready to action.
            </p>
          </Animate>
          <Animate variant="bottom" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/provider/register">
                <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
                  Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/provider/login">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                  Provider Login <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </Animate>
        </div>
      </section>

      {/* What is the live feed */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Animate variant="left">
              <div>
                <div className="text-teal text-sm font-semibold uppercase tracking-widest mb-4">What Is the Live Feed?</div>
                <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-6">
                  Real Enquiries. Real Participants. Real Time.
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Every day, we receive accommodation enquiries from NDIS participants, their families, and support coordinators through our marketing channels and CRM. These enquiries are automatically fed into the APGP platform as they arrive.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  As a registered APGP provider, you see these enquiries in real time — anonymised to protect participant privacy, but containing all the information you need to assess whether you have a suitable property.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  When you find a match, you express interest directly in the platform. Our team then facilitates the introduction and manages the full intake process through to move-in.
                </p>
              </div>
            </Animate>

            {/* Sample lead cards (blurred) */}
            <Animate variant="right" delay={0.1}>
              <div className="relative">
                <div className="space-y-4">
                  {sampleLeads.map((lead, i) => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
                      style={{ filter: i > 0 ? "blur(2px)" : "none", opacity: i === 0 ? 1 : 0.6 }}
                    >
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {i === 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> NEW
                          </span>
                        )}
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-navy text-white">{lead.type}</span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />NDIS Registered
                        </span>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded ml-auto">
                          ID: {lead.id}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {[
                          ["Dwelling", lead.dwelling],
                          ["Timeline", lead.timeline],
                          ["State", lead.state],
                          ["Submitted by", lead.requester],
                        ].map(([label, val]) => (
                          <div key={label} className="bg-gray-50 rounded-xl p-2.5">
                            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                            <p className="text-sm font-semibold text-navy">{val}</p>
                          </div>
                        ))}
                      </div>
                      {i === 0 ? (
                        <div className="bg-teal text-white text-sm font-semibold rounded-xl px-4 py-2.5 text-center">
                          I'm Interested — View Referral Agreement
                        </div>
                      ) : (
                        <div className="bg-gray-100 rounded-xl h-9" />
                      )}
                    </div>
                  ))}
                </div>
                {/* Lock overlay on bottom cards */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Lock className="w-4 h-4" />
                    Register to see all live enquiries
                  </div>
                </div>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* What you see / don't see */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <Animate variant="bottom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-navy font-heading mb-4">What's Included in Each Enquiry</h2>
              <p className="text-gray-600 text-lg">
                Every enquiry contains enough detail to assess suitability — without compromising participant privacy.
              </p>
            </div>
          </Animate>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Animate variant="left">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center">
                    <Eye className="w-5 h-5 text-teal" />
                  </div>
                  <h3 className="font-bold text-navy font-heading text-lg">What You See</h3>
                </div>
                <ul className="space-y-3">
                  {whatYouSee.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-navy">{item.label}</span>
                        <span className="text-xs text-gray-400 ml-2">e.g. {item.example}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Animate>
            <Animate variant="right" delay={0.1}>
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="font-bold text-navy font-heading text-lg">What's Protected</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  To protect participant privacy, the following information is never shown to providers in the feed:
                </p>
                <ul className="space-y-3">
                  {whatYouDontSee.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-red-300 shrink-0 mt-0.5 flex items-center justify-center">
                        <div className="w-1.5 h-0.5 bg-red-400 rounded" />
                      </div>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-5 leading-relaxed">
                  Personal information is only shared after the provider submits a signed Referral Agreement and Consent Form, and our team has reviewed the match.
                </p>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* How it works steps */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-4xl">
          <Animate variant="bottom">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-navy font-heading mb-4">How It Works — Step by Step</h2>
              <p className="text-gray-600 text-lg">From enquiry to placement — the full process explained.</p>
            </div>
          </Animate>
          <div className="space-y-5">
            {howItWorks.map((step, i) => (
              <Animate key={step.step} variant={i % 2 === 0 ? "left" : "right"} delay={i * 0.07}>
                <div className="flex gap-6 items-start bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-shadow">
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-teal-300 font-extrabold font-heading text-lg">
                      {step.step}
                    </div>
                    {i < howItWorks.length - 1 && <div className="w-0.5 h-6 bg-gray-200 rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center text-teal shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="font-bold text-navy font-heading text-lg">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* Why this is valuable */}
      <section className="py-16 lg:py-24 bg-teal-light">
        <div className="container max-w-4xl">
          <Animate variant="bottom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy font-heading mb-4">Why the Live Feed Changes Everything</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Most providers spend months waiting for the right participant to come along. The APGP live feed puts you in front of qualified enquiries the moment they arrive.
              </p>
            </div>
          </Animate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-7 h-7 text-teal" />,
                title: "Real-Time Access",
                desc: "Enquiries appear in your dashboard the moment they arrive from our CRM — no waiting, no weekly reports, no missed opportunities.",
                variant: "left" as const,
              },
              {
                icon: <Shield className="w-7 h-7 text-teal" />,
                title: "Pre-Qualified Leads",
                desc: "Every enquiry in the feed comes from our participant pipeline — meaning they've already been through our initial qualification process.",
                variant: "bottom" as const,
              },
              {
                icon: <TrendingUp className="w-7 h-7 text-teal" />,
                title: "Pay Per Result",
                desc: "You only pay when a participant moves into your property. Browsing the feed and expressing interest is completely free.",
                variant: "right" as const,
              },
            ].map((card) => (
              <Animate key={card.title} variant={card.variant}>
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mb-5">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-navy font-heading mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container max-w-3xl">
          <Animate variant="bottom">
            <h2 className="text-3xl font-bold text-navy font-heading text-center mb-10">Common Questions</h2>
          </Animate>
          <div className="space-y-5">
            {[
              {
                q: "Who can see the live enquiries feed?",
                a: "Only registered APGP providers who have created a free account and logged in to the Provider Portal. The feed is not visible to the public.",
              },
              {
                q: "How often are new enquiries added?",
                a: "Enquiries are added in real time as they arrive through our participant pipeline. New leads are marked with a 'NEW' badge for the first 48 hours.",
              },
              {
                q: "What happens after I express interest?",
                a: "You sign a Referral Agreement and Consent Form directly in the platform. Our team then reviews your interest and contacts both you and the participant to progress the placement.",
              },
              {
                q: "Is there a cost to access the feed?",
                a: "No. Registering for APGP and accessing the live enquiries feed is completely free. You only pay a success-based fee when a participant moves into your accommodation.",
              },
              {
                q: "Can I express interest in multiple enquiries?",
                a: "Yes. You can express interest in as many enquiries as you have suitable properties for. Each expression of interest requires a separate Referral Agreement and Consent Form.",
              },
            ].map((item, i) => (
              <Animate key={item.q} variant="bottom" delay={i * 0.06}>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-navy font-heading mb-2">{item.q}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-20 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal blur-3xl" />
        </div>
        <div className="container max-w-2xl relative z-10">
          <Animate variant="bottom">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-1.5 text-sm text-green-300 font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Enquiries are live right now
            </div>
            <h2 className="text-4xl font-extrabold font-heading mb-6">
              Don't Miss the Next Enquiry.<br />
              <span className="text-teal-300">Register Free Today.</span>
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Create your free APGP provider account and get immediate access to the live participant enquiries feed. Every enquiry is a potential placement — and you only pay when they move in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/provider/register">
                <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
                  Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/provider/login">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                  Already registered? Sign in
                </Button>
              </Link>
            </div>
          </Animate>
        </div>
      </section>
    </PublicLayout>
  );
}
