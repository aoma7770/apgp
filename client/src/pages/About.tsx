import { Building2, Heart, Globe, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import JotformModal from "@/components/JotformModal";

export default function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">About the Program</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">
            A New Way Forward for SDA &amp; SIL Providers
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            The Accommodation Provider Growth Program (APGP) is a structured partnership initiative by Ausnew Support Services, designed to solve one of the most persistent challenges in the NDIS accommodation sector — vacant properties and unpredictable referral flow.
          </p>
        </div>
      </section>

      {/* The challenge */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy font-heading mb-6">The Challenge Providers Face</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Across Australia, high-quality SDA and SIL homes sit vacant while providers absorb the full cost of maintaining empty rooms. Referral flow is unpredictable, marketing is expensive, and the intake process is time-consuming.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Without a consistent pipeline of placement-ready participants, even the best-managed properties struggle to achieve stable occupancy — creating financial pressure that undermines the quality of support delivered to residents.
              </p>
              <p className="text-gray-600 leading-relaxed">
                APGP was designed specifically to address this. By partnering with Ausnew Support Services, providers gain access to a professionally managed intake system, participant matching, and ongoing vacancy support — all structured with zero financial risk.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Building2 className="w-6 h-6 text-teal" />, title: "Vacant Properties", desc: "High-quality SDA/SIL homes sitting empty due to lack of referral flow." },
                { icon: <Globe className="w-6 h-6 text-teal" />, title: "Unpredictable Intake", desc: "Inconsistent referral sources make occupancy planning impossible." },
                { icon: <Heart className="w-6 h-6 text-teal" />, title: "Participant Matching", desc: "Finding participants whose needs align with specific property features." },
                { icon: <CheckCircle2 className="w-6 h-6 text-teal" />, title: "APGP Solution", desc: "A structured, zero-risk partnership that delivers consistent occupancy." },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-navy font-heading text-sm mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Ausnew */}
      <section className="py-16 lg:py-24 bg-teal-light">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-navy font-heading mb-6">About Ausnew Support Services</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Ausnew Support Services is a registered NDIS provider delivering a range of disability support services across Australia, including Community Access, Supported Independent Living (SIL), and Specialist Disability Accommodation (SDA) placement coordination.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            With years of experience in participant intake, support coordination, and accommodation matching, Ausnew has developed the APGP as a structured, scalable program that benefits both providers and participants. All partnership arrangements under APGP are strictly business-to-business and entirely separate from NDIS funding processes.
          </p>
          <a href="https://ausnewdisability.com" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
              Visit Ausnew Support Services <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      {/* Key principles */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-navy font-heading text-center mb-12">Program Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Zero Financial Risk", desc: "Providers pay nothing until a participant successfully completes intake and moves into their accommodation. All upfront work — marketing, qualification, matching — is carried out by Ausnew." },
              { title: "Ethical Transparency", desc: "All partnership arrangements are business-to-business. Fees relate solely to commercial services provided by Ausnew. These arrangements do not involve participant billing and are entirely separate from NDIS funding." },
              { title: "Quality Matching", desc: "Every participant referred through APGP is professionally screened, intake-ready, and matched to properties based on support needs, location, and property features — ensuring stable, long-term placements." },
            ].map((item) => (
              <div key={item.title} className="border-l-4 border-teal pl-6">
                <h3 className="font-bold text-navy font-heading mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Partner with APGP?</h2>
          <p className="text-gray-300 mb-8">Register your organisation for free and our team will be in touch to discuss your partnership options.</p>
          <JotformModal label="Register Now — Free" size="lg" buttonClassName="px-10" />
        </div>
      </section>
    </PublicLayout>
  );
}
