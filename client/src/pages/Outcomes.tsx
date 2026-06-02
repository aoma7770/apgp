import { Building2, TrendingUp, Users, Shield, Star, Clock } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import JotformModal from "@/components/JotformModal";

export default function Outcomes() {
  return (
    <PublicLayout>
      <section className="bg-navy text-white py-16 lg:py-24">
        <div className="container max-w-3xl text-center">
          <div className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Program Outcomes</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-heading mb-6">What APGP Delivers</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            A predictable, reliable stream of participants ready for onboarding — enabling providers to focus on what they do best: delivering exceptional in-home supports.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Building2 className="w-7 h-7 text-teal" />, title: "Stable Occupancy", desc: "Maintain consistent occupancy rates through a managed pipeline of pre-qualified, intake-ready participants matched to your specific properties." },
              { icon: <Clock className="w-7 h-7 text-teal" />, title: "Reduced Vacancy Downtime", desc: "Minimise the time between participants with priority replacement search and proactive vacancy management included in the Vacancy Protection Plan." },
              { icon: <Star className="w-7 h-7 text-teal" />, title: "No Marketing Overhead", desc: "Remove the cost and effort of marketing your vacancies. Ausnew handles all lead generation, qualification, and matching on your behalf." },
              { icon: <Users className="w-7 h-7 text-teal" />, title: "Quality Participant Matching", desc: "Every participant is professionally screened and assessed for suitability before being matched to your property — improving placement quality and retention." },
              { icon: <Shield className="w-7 h-7 text-teal" />, title: "Focus on In-Home Supports", desc: "With intake, marketing, and matching handled by Ausnew, your team can focus entirely on delivering exceptional in-home support to residents." },
              { icon: <TrendingUp className="w-7 h-7 text-teal" />, title: "Long-Term Growth", desc: "Build a sustainable, growing accommodation portfolio backed by a consistent referral partner with a proven track record in NDIS participant placement." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-teal-light flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-navy font-heading mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-teal-light">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-navy font-heading mb-6">Partnership Engagement</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            All partnership arrangements under the Accommodation Provider Growth Program are strictly business-to-business. Fees relate solely to the commercial services provided by Ausnew Support Services to accommodation providers, such as marketing, intake coordination, participant matching, vacancy support, and ongoing portfolio management.
          </p>
          <p className="text-gray-700 leading-relaxed">
            These arrangements do not involve participant billing and are entirely separate from NDIS funding processes.
          </p>
        </div>
      </section>

      <section className="bg-navy py-16 text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Achieve These Outcomes?</h2>
          <p className="text-gray-300 mb-8">Register your organisation for free and start your APGP partnership journey today.</p>
          <JotformModal label="Register Now — Free" size="lg" buttonClassName="px-10" />
        </div>
      </section>
    </PublicLayout>
  );
}
