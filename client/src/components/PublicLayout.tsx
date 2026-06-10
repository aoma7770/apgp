import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingRegisterButton from "@/components/FloatingRegisterButton";
import LeadNotificationToast from "@/components/LeadNotificationToast";
import APGPLogo from "@/components/APGPLogo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About APGP", href: "/about" },
  {
    label: "Partnership Pathways",
    href: "/pathways",
    children: [
      { label: "Joint Venture Partnership", href: "/pathways#jv" },
      { label: "Referral Partnership", href: "/pathways#referral" },
    ],
  },
  { label: "Done For You", href: "/done-for-you" },
  { label: "Participant Enquiries", href: "/participant-enquiries" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Outcomes", href: "/outcomes" },
  { label: "FAQ", href: "/faq" },
];

const CONTACT_EMAIL = "provider@APGPaccommodation.com.au";
const CONTACT_PHONE = "(02) 9669 9302";
const CONTACT_PHONE_HREF = "tel:+61296699302";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Top contact bar ── */}
      <div className="bg-navy text-white text-xs py-2 hidden sm:block">
        <div className="container flex items-center justify-end gap-6">
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-1.5 hover:text-teal-300 transition-colors">
            <Mail className="w-3 h-3" />
            {CONTACT_EMAIL}
          </a>
          <a href={CONTACT_PHONE_HREF} className="flex items-center gap-1.5 hover:text-teal-300 transition-colors">
            <Phone className="w-3 h-3" />
            {CONTACT_PHONE}
          </a>
        </div>
      </div>

      {/* ── Main navigation ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <APGPLogo variant="full" height={36} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      location.startsWith(link.href) ? "text-teal bg-teal-light" : "text-gray-700 hover:text-navy hover:bg-gray-50"
                    )}
                    onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                    onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
                  >
                    {link.label}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === link.label ? "rotate-180" : "")} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-48 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:text-teal hover:bg-teal-light transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location === link.href ? "text-teal bg-teal-light" : "text-gray-700 hover:text-navy hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <Link href="/provider/login">
              <Button variant="outline" size="sm" className="border-navy text-navy hover:bg-navy hover:text-white transition-colors">
                Provider Login
              </Button>
            </Link>
            <Link href="/provider/register">
              <Button size="sm" className="bg-teal hover:bg-teal-600 text-white font-semibold">
                Register Free
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="xl:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white py-4 px-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{link.label}</p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-5 py-2 text-sm text-gray-700 hover:text-teal transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location === link.href ? "text-teal bg-teal-light" : "text-gray-700 hover:text-navy hover:bg-gray-50"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/provider/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full border-navy text-navy">Provider Login</Button>
              </Link>
              <Link href="/provider/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-teal hover:bg-teal-600 text-white font-semibold">Register Free</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="flex-1">{children}</main>

      {/* ── Floating register button ── */}
      <FloatingRegisterButton />
      <LeadNotificationToast isPublic={true} />

      {/* ── Footer ── */}
      <footer className="bg-navy text-white">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center mb-4">
                <APGPLogo variant="white" height={44} />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Australia's leading NDIS accommodation provider growth program. Real occupancy. Real stability. Zero upfront cost.
              </p>
              <div className="space-y-2">
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-teal-300 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                  {CONTACT_EMAIL}
                </a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 text-xs text-gray-400 hover:text-teal-300 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                  {CONTACT_PHONE}
                </a>
              </div>
            </div>

            {/* Program */}
            <div>
              <h4 className="font-bold text-white font-heading mb-4 text-sm uppercase tracking-widest">Program</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-teal transition-colors">About APGP</Link></li>
                <li><Link href="/pathways" className="hover:text-teal transition-colors">Partnership Pathways</Link></li>
                <li><Link href="/done-for-you" className="hover:text-teal transition-colors">Done For You</Link></li>
                <li><Link href="/pricing" className="hover:text-teal transition-colors">Pricing Structure</Link></li>
                <li><Link href="/outcomes" className="hover:text-teal transition-colors">Program Outcomes</Link></li>
                <li><Link href="/faq" className="hover:text-teal transition-colors">FAQ</Link></li>
                <li><Link href="/participant-enquiries" className="hover:text-teal transition-colors">Participant Enquiries</Link></li>
                <li><Link href="/blog" className="hover:text-teal transition-colors">Blog</Link></li>
                <li><Link href="/terms" className="hover:text-teal transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Providers */}
            <div>
              <h4 className="font-bold text-white font-heading mb-4 text-sm uppercase tracking-widest">Providers</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link href="/provider/register" className="hover:text-teal transition-colors font-semibold text-teal-300">
                    Register Free →
                  </Link>
                </li>
                <li><Link href="/provider/login" className="hover:text-teal transition-colors">Provider Login</Link></li>
                <li><Link href="/provider/dashboard" className="hover:text-teal transition-colors">My Dashboard</Link></li>
              </ul>
            </div>

            {/* Register CTA */}
            <div>
              <h4 className="font-bold text-white font-heading mb-4 text-sm uppercase tracking-widest">Get Started</h4>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Create your free provider account and access the live participant enquiries feed today.
              </p>
              <Link href="/provider/register">
                <Button className="bg-teal hover:bg-teal-600 text-white font-semibold w-full">
                  Register Free — No Cost
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Accommodation Provider Growth Program. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gray-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
