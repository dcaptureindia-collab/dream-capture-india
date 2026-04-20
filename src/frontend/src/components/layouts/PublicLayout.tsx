import type { AppConfig } from "@/backend.d";
import { Button } from "@/components/ui/button";
import { useBackend } from "@/hooks/use-backend";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Crown, Instagram, Mail, Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Benefits", href: "#benefits" },
  { label: "How to Join", href: "#how-to-join" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { actor, isLoading: actorLoading } = useBackend();
  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  const { data: config } = useQuery<AppConfig>({
    queryKey: ["config"],
    queryFn: () => actor!.getConfig(),
    enabled: !!actor && !actorLoading,
  });

  const whatsappNumber = config?.whatsappNumber ?? "919999999999";
  const email = config?.email ?? "contact@dreamcaptureindia.com";
  const instagramHandle = config?.instagramHandle ?? "dreamcaptureindia";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border/50 shadow-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              data-ocid="nav.logo_link"
            >
              <Crown className="w-5 h-5 text-primary transition-smooth group-hover:scale-110" />
              <span className="font-display text-lg font-semibold text-primary tracking-wide">
                Dream Capture India
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/candidate/dashboard" data-ocid="nav.member_login_link">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Member Login
                </Button>
              </Link>
              <Link to="/apply" data-ocid="nav.apply_now_button">
                <Button
                  type="button"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-smooth px-5"
                >
                  Apply Now
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              data-ocid="nav.hamburger_toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="md:hidden bg-card border-t border-border/50 px-4 py-5 space-y-1 shadow-luxury"
            data-ocid="nav.mobile_menu"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
                data-ocid={`nav.mobile_${link.label.toLowerCase().replace(/\s+/g, "_")}_link`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link
                to="/candidate/dashboard"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile_login_link"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm text-muted-foreground"
                >
                  Member Login
                </Button>
              </Link>
              <Link
                to="/apply"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile_apply_button"
              >
                <Button
                  type="button"
                  size="sm"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  Apply Now — ₹1499
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 pt-16">{children}</main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-card border-t border-border/50 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <span className="font-display text-lg font-semibold text-primary">
                  Dream Capture India
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India's premier luxury modelling & casting agency. We connect
                aspiring talent with elite brands and productions.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-display text-sm font-semibold text-foreground tracking-widest uppercase">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    to="/apply"
                    className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                  >
                    Apply Now — ₹1499
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-display text-sm font-semibold text-foreground tracking-widest uppercase">
                Connect With Us
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    data-ocid="footer.whatsapp_link"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    data-ocid="footer.email_link"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us
                  </a>
                </li>
                <li>
                  <a
                    href={`https://instagram.com/${instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    data-ocid="footer.instagram_link"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {currentYear} Dream Capture India. All rights reserved.</p>
            <p>
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-200"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
