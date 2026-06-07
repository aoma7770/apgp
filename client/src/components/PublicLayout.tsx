import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import JotformModal from "@/components/JotformModal";
import FloatingRegisterButton from "@/components/FloatingRegisterButton";
import LeadNotificationToast from "@/components/LeadNotificationToast";
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

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Top contact bar ── */}
      <div className="bg-navy-dark border-b border-white/10 hidden md:block">
        <div className="container">
          <div className="flex items-center justify-end gap-6 py-2 text-xs text-gray-400">
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
      </div>

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-lg font-heading">
                A
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-navy leading-tight font-heading">APGP</div>
                <div className="text-xs text-teal leading-tight">by Ausnew Support Services</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        location.startsWith(link.href)
                          ? "text-teal bg-teal-light"
                          : "text-gray-700 hover:text-navy hover:bg-gray-50"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", dropdownOpen && "rotate-180")} />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:text-navy hover:bg-teal-light transition-colors"
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
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location === link.href
                        ? "text-teal bg-teal-light"
                        : "text-gray-700 hover:text-navy hover:bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/provider/login">
                <Button variant="outline" size="sm" className="border-navy text-navy hover:bg-navy hover:text-white transition-colors">
                  Provider Login
                </Button>
              </Link>
              <JotformModal label="Register Free" size="sm" showArrow={false} buttonClassName="hover:bg-teal-600" />
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-navy hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="container py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      location === link.href
                        ? "text-teal bg-teal-light"
                        : "text-gray-700 hover:text-navy hover:bg-gray-50"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block pl-6 pr-3 py-2 text-sm text-gray-600 hover:text-navy hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <Link href="/provider/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy hover:text-white">
                    Provider Login
                  </Button>
                </Link>
                <JotformModal
                  label="Register Free"
                  buttonClassName="w-full"
                  trigger={(open) => (
                    <Button
                      className="w-full bg-teal hover:bg-teal-600 text-white"
                      onClick={() => { setMobileOpen(false); open(); }}
                    >
                      Register Free
                    </Button>
                  )}
                />
                {/* Mobile contact */}
                <div className="pt-2 flex flex-col gap-1.5">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-xs text-gray-500 px-1">
                    <Mail className="w-3.5 h-3.5 text-teal" />{CONTACT_EMAIL}
                  </a>
                  <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 text-xs text-gray-500 px-1">
                    <Phone className="w-3.5 h-3.5 text-teal" />{CONTACT_PHONE}
                  </a>
                </div>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center text-white font-bold text-lg font-heading">
                  A
                </div>
                <div>
                  <div className="font-bold text-white font-heading">APGP</div>
                  <div className="text-xs text-teal-300">Accommodation Provider Growth Program</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                Partnership pathways that deliver real occupancy, real stability, and real growth for SDA and SIL accommodation providers across Australia.
              </p>
              <p className="text-xs text-gray-400 mt-4">
                A program by{" "}
                <a href="https://ausnewdisability.com" target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal transition-colors">
                  Ausnew Support Services
                </a>
              </p>
              {/* Contact */}
              <div className="mt-5 space-y-2">
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-teal-300 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-teal shrink-0" />
                  {CONTACT_EMAIL}
                </a>
                <a href={CONTACT_PHONE_HREF} className="flex items-center gap-2 text-xs text-gray-400 hover:text-teal-300 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-teal shrink-0" />
                  {CONTACT_PHONE}
                </a>
              </div>
            </div>

            {/* Program */}
            <div>
              <h4 className="font-semibold text-white mb-3 font-heading">Program</h4>
              <ul className="space-y-2 text-sm text-gray-300">
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
              <h4 className="font-semibold text-white mb-3 font-heading">Providers</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <JotformModal
                    label="Register Free"
                    showArrow={false}
                    trigger={(open) => (
                      <button onClick={open} className="hover:text-teal transition-colors text-left">
                        Register Free
                      </button>
                    )}
                  />
                </li>
                <li><Link href="/provider/login" className="hover:text-teal transition-colors">Provider Login</Link></li>
                <li><Link href="/provider/dashboard" className="hover:text-teal transition-colors">My Dashboard</Link></li>

              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Accommodation Provider Growth Program. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <Link href="/terms" className="hover:text-teal-300 transition-colors">Terms of Service</Link>
              <span>·</span>
              <p>All partnership arrangements are business-to-business and separate from NDIS funding processes.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
