import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "What exactly is the Accommodation Provider Growth Program (APGP)?",
    a: "The APGP is a structured partnership program by Ausnew Support Services that connects SDA and SIL accommodation providers with a consistent supply of placement-ready NDIS participants. It operates through two pathways — the Joint Venture Partnership and the Referral Partnership — both designed with zero financial risk to providers.",
  },
  {
    q: "Are you a real support provider, or just a referral agency?",
    a: "Ausnew Support Services is a registered NDIS provider delivering Community Access supports, Supported Independent Living coordination, and accommodation placement services. We are not simply a referral agency — we deliver real supports to participants and partner with accommodation providers to ensure stable, long-term placements.",
  },
  {
    q: "When does a referral fee apply, and when does it not?",
    a: "Under the Joint Venture Partnership, no placement fee applies because Ausnew is delivering ongoing Community Access supports to the participant — the arrangement is a shared service delivery model. Under the Referral Partnership, a success-based placement fee applies only when a participant completes intake and moves into your accommodation.",
  },
  {
    q: "What is the JV Partnership, and why would a provider choose it?",
    a: "The Joint Venture Partnership is designed for situations where Ausnew can deliver ongoing Community Access supports to the participant. Providers choose this pathway because there is no placement fee, the intake process is fully managed, and the shared support model strengthens participant stability and retention.",
  },
  {
    q: "What types of supports can Ausnew provide?",
    a: "Ausnew Support Services delivers Community Access supports, social and community participation, and support coordination. In the context of APGP, Ausnew focuses on Community Access supports delivered to participants living in partner providers' SDA and SIL properties.",
  },
  {
    q: "What is the Vacancy Protection Plan (VPP), and is it mandatory?",
    a: "The Vacancy Protection Plan is an optional weekly subscription available under the Referral Partnership. It provides priority replacement search if a participant exits, ongoing visibility of your vacancies, continuous intake activity and matching, and CRM maintenance of your property portfolio. It is not mandatory but is strongly recommended for providers seeking consistent long-term occupancy.",
  },
  {
    q: "How does APGP benefit accommodation providers?",
    a: "APGP enables providers to maintain stable occupancy, reduce vacancy downtime, remove marketing and recruitment overhead, improve participant matching quality, and focus on delivering exceptional in-home supports — all through a zero-financial-risk partnership structure.",
  },
  {
    q: "How does APGP benefit participants?",
    a: "Participants benefit from professional matching to properties that meet their specific support needs, a managed intake process that reduces administrative burden, and access to quality SDA and SIL accommodation with appropriate support structures in place.",
  },
  {
    q: "How does APGP ensure transparency and ethical collaboration?",
    a: "All partnership arrangements under APGP are strictly business-to-business. Fees relate solely to commercial services provided by Ausnew to accommodation providers — marketing, intake coordination, participant matching, vacancy support, and portfolio management. These arrangements do not involve participant billing and are entirely separate from NDIS funding processes.",
  },
  {
    q: "Why partner with Ausnew instead of managing vacancies alone?",
    a: "Managing vacancies independently requires significant investment in marketing, lead generation, qualification, and intake coordination. Ausnew brings an established pipeline of pre-qualified participants, professional matching capabilities, and a proven intake process — delivered on a success-based model that means you only pay when a participant moves in.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-navy text-sm leading-snug">{q}</span>
        <ChevronDown className={cn("w-5 h-5 text-teal shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <PublicLayout>
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">FAQ</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">Frequently Asked Questions</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Everything you need to know about the Accommodation Provider Growth Program.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-3xl font-bold font-heading mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 mb-8">Register your organisation and our team will reach out to answer any specific questions about your situation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/provider/register">
              <Button size="lg" className="bg-teal hover:bg-teal-600 text-white font-semibold px-10">
                Register Now — Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="tel:+61296699302">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors text-sm font-medium">
                Call (02) 9669 9302
              </button>
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
