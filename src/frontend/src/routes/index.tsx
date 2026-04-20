import type { AppConfig } from "@/backend.d";
import PublicLayout from "@/components/layouts/PublicLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/use-backend";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Crown,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Network,
  ShieldCheck,
  Star,
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    label: "Fashion Shoot",
    desc: "Top brands ke liye runway & editorial",
    gradient: "from-secondary/80 to-card",
  },
  {
    label: "Jewellery Shoot",
    desc: "Premium jewellery & accessories campaigns",
    gradient: "from-secondary/70 to-card",
  },
  {
    label: "Bridal Shoot",
    desc: "Bridal wear editorials & lookbooks",
    gradient: "from-secondary/60 to-card",
  },
  {
    label: "E-Commerce",
    desc: "Online store product photography",
    gradient: "from-secondary/80 to-card",
  },
  {
    label: "Catalogue",
    desc: "Brand catalogues & seasonal collections",
    gradient: "from-secondary/70 to-card",
  },
  {
    label: "Web Series",
    desc: "OTT & digital streaming projects",
    gradient: "from-secondary/60 to-card",
  },
  {
    label: "Music Video",
    desc: "Artist music video appearances",
    gradient: "from-secondary/80 to-card",
  },
  {
    label: "Brand Promotion",
    desc: "Brand ambassador & endorsement deals",
    gradient: "from-secondary/70 to-card",
  },
  {
    label: "International Projects",
    desc: "Global campaigns & overseas shoots",
    gradient: "from-secondary/60 to-card",
  },
];

const BENEFITS = [
  {
    Icon: Camera,
    title: "Professional Portfolio Build",
    description:
      "Expert photoshoots aur portfolio creation jisse aapka talent top brands tak pahunche. Industry-standard portfolio jo aapko alag khada kare.",
  },
  {
    Icon: Network,
    title: "Industry Network",
    description:
      "Leading photographers, directors, aur premium brands se direct connection. India ke fashion industry ke insiders ke saath networking.",
  },
  {
    Icon: Star,
    title: "Paid Assignments",
    description:
      "Real paid projects milte hain — selection ke baad 20% advance payment aur shoot completion ke baad remaining payment.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Apply Online",
    desc: "Website par form bharo aur basic details submit karo",
  },
  {
    num: "02",
    title: "Pay Registration Fee",
    desc: "₹1499 onboarding fee — verification & profile setup ke liye",
  },
  {
    num: "03",
    title: "Create Your Profile",
    desc: "Portfolio upload karo, measurements aur details bharo",
  },
  {
    num: "04",
    title: "Admin Verification",
    desc: "Hamari team aapka profile review aur verify karegi",
  },
  {
    num: "05",
    title: "Get Projects",
    desc: "Matching projects milenge — shooting schedule receive karo!",
  },
];

const GALLERY_ITEMS = [
  { label: "Fashion Shoot", aspect: "aspect-[3/4]" },
  { label: "Jewellery Shoot", aspect: "aspect-square" },
  { label: "Bridal Shoot", aspect: "aspect-[4/5]" },
  { label: "E-Commerce", aspect: "aspect-[3/4]" },
  { label: "Catalogue", aspect: "aspect-square" },
  { label: "Music Video", aspect: "aspect-[4/5]" },
  { label: "Brand Promotion", aspect: "aspect-[3/4]" },
  { label: "Web Series", aspect: "aspect-square" },
];

const GALLERY_GRADIENTS = [
  "from-secondary via-card to-background",
  "from-card via-secondary/50 to-background",
  "from-secondary/80 via-card to-secondary/30",
  "from-card via-secondary to-background",
  "from-secondary/60 via-card to-secondary",
  "from-card to-secondary/70",
  "from-secondary to-card",
  "from-secondary/50 to-background",
];

// ── Contact Section (live config) ───────────────────────────────────────

function ContactSection() {
  const { actor, isLoading } = useBackend();
  const { data: config } = useQuery<AppConfig>({
    queryKey: ["appConfig"],
    queryFn: async () => {
      if (!actor)
        return {
          stripePublicKey: "",
          paymentAmount: BigInt(1499),
          whatsappNumber: "919999999999",
          email: "contact@dreamcaptureindia.com",
          instagramHandle: "dreamcaptureindia",
        };
      return actor.getConfig();
    },
    enabled: !!actor && !isLoading,
    staleTime: 5 * 60 * 1000,
  });

  const items = [
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      display: config ? `+${config.whatsappNumber}` : "+91 99999 99999",
      href: config
        ? `https://wa.me/${config.whatsappNumber}`
        : "https://wa.me/919999999999",
      ocid: "contact.whatsapp_link",
      external: true,
    },
    {
      Icon: Mail,
      label: "Email",
      display: config?.email ?? "contact@dreamcaptureindia.com",
      href: config
        ? `mailto:${config.email}`
        : "mailto:contact@dreamcaptureindia.com",
      ocid: "contact.email_link",
      external: false,
    },
    {
      Icon: Instagram,
      label: "Instagram",
      display: config ? `@${config.instagramHandle}` : "@dreamcaptureindia",
      href: config
        ? `https://instagram.com/${config.instagramHandle}`
        : "https://instagram.com/dreamcaptureindia",
      ocid: "contact.instagram_link",
      external: true,
    },
  ];

  return (
    <section
      className="py-20 bg-card border-t border-border/30"
      id="contact"
      data-ocid="contact.section"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 border-primary/30 text-primary bg-primary/5 text-xs tracking-widest uppercase px-4 py-1"
          >
            <Globe className="w-3 h-3 mr-1.5 inline" />
            Hamse Judo
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Contact Karo
          </h2>
          <p className="text-muted-foreground">
            Koi bhi sawaal? Hum yahan hain — seedha contact karo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ Icon, label, display, href, ocid, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              data-ocid={ocid}
              className="group flex flex-col items-center gap-4 bg-background border border-border/50 rounded-sm p-8 hover:border-primary/50 hover:shadow-gold transition-smooth text-center"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">
                  {label}
                </p>
                {isLoading && !config ? (
                  <Skeleton className="h-4 w-32 mx-auto" />
                ) : (
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {display}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Homepage ────────────────────────────────────────────────────────────

export function HomePage() {
  return (
    <PublicLayout>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
        id="hero"
        data-ocid="hero.section"
      >
        {/* Background model image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/assets/generated/hero-model.dim_1200x900.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          {/* Deep overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-secondary/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Gold particle orbs — pure CSS */}
        <div
          className="absolute top-1/4 left-1/6 w-72 h-72 bg-primary/4 rounded-full blur-3xl animate-particle pointer-events-none"
          style={{ animationDelay: "0s" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-particle pointer-events-none"
          style={{ animationDelay: "1.5s" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Shimmer line top */}
        <div
          className="absolute top-0 left-0 right-0 h-px overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="h-full w-full animate-gold-shimmer" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-32">
          <div className="animate-fade-in">
            <Badge
              variant="outline"
              className="mb-8 border-primary/40 text-primary bg-primary/5 text-xs tracking-[0.25em] uppercase px-5 py-1.5"
            >
              <Crown className="w-3 h-3 mr-2 inline" />
              India's Premier Casting Agency
            </Badge>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6 animate-slide-up delay-100">
            <span className="text-foreground">Dream</span>{" "}
            <span className="gold-shimmer-text">Capture</span>
            <br />
            <span className="text-foreground">India</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-2 leading-relaxed animate-slide-up delay-200">
            India Ki Premium Modelling &amp; Casting Agency
          </p>
          <p className="text-base text-muted-foreground/60 max-w-xl mx-auto mb-12 animate-slide-up delay-300">
            Fashion, Jewellery, Bridal, Web Series, Music Videos &amp;
            International Projects — sabke liye ek platform jahan talent ko
            recognition milti hai.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-400">
            <Link to="/apply" data-ocid="hero.apply_now_button">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-10 py-4 h-auto shadow-luxury transition-smooth group"
              >
                Apply Now — ₹1499
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#projects" data-ocid="hero.view_projects_link">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-border/60 text-foreground hover:border-primary/60 hover:text-primary text-base px-10 py-4 h-auto transition-smooth"
              >
                View Projects
              </Button>
            </a>
          </div>

          <p className="mt-8 text-xs text-muted-foreground/40 animate-fade-in delay-500">
            ₹1499 onboarding fee • Verification &amp; profile setup only • Not a
            job guarantee
          </p>
        </div>

        {/* Bottom shimmer line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-full w-full animate-gold-shimmer"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </section>

      {/* ── Project Categories ─────────────────────────────────────── */}
      <section
        className="py-24 bg-background"
        id="projects"
        data-ocid="projects.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary bg-primary/5 text-xs tracking-widest uppercase px-4 py-1"
            >
              Opportunities
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Project Categories
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              India ke thriving fashion aur entertainment industry mein diverse
              opportunities
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.label}
                data-ocid={`projects.item.${i + 1}`}
                className={`relative bg-gradient-to-br ${cat.gradient} border border-border/40 rounded-sm p-6 text-left hover:border-primary/50 hover:scale-[1.03] hover:shadow-luxury transition-smooth cursor-default group overflow-hidden`}
              >
                {/* Hover shimmer overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 animate-gold-shimmer opacity-10" />
                  <div className="absolute inset-x-0 top-0 h-px bg-primary/30 border-shimmer" />
                </div>
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 text-sm sm:text-base leading-tight">
                  {cat.label}
                </h3>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────────────────── */}
      <section
        className="py-24 bg-card border-y border-border/30"
        id="benefits"
        data-ocid="benefits.section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary bg-primary/5 text-xs tracking-widest uppercase px-4 py-1"
            >
              Kyun Humse Judo?
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Dream Capture India Ke Fayde
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Platform jo aapke career ko nai heights par le jaye
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {BENEFITS.map((b, i) => {
              const BenIcon = b.Icon;
              return (
                <div
                  key={b.title}
                  data-ocid={`benefits.item.${i + 1}`}
                  className="relative bg-secondary/30 border border-border/40 rounded-sm p-8 hover:border-primary/40 hover:shadow-gold transition-smooth group flex flex-col"
                >
                  {/* Gold accent top bar */}
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/40 transition-smooth">
                    <BenIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How to Join ────────────────────────────────────────────── */}
      <section
        className="py-24 bg-background"
        id="how-to-join"
        data-ocid="how_to_join.section"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary bg-primary/5 text-xs tracking-widest uppercase px-4 py-1"
            >
              Process
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              How to Join
            </h2>
            <p className="text-muted-foreground">
              5 simple steps mein apna modelling career shuru karo
            </p>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:flex items-start gap-0 relative">
            {/* Connecting line */}
            <div
              className="absolute top-7 left-10 right-10 h-px bg-border/50"
              aria-hidden="true"
            >
              <div className="absolute inset-0 animate-gold-shimmer opacity-30" />
            </div>

            {STEPS.map((s, i) => (
              <div
                key={s.num}
                data-ocid={`how_to_join.step.${i + 1}`}
                className="flex-1 flex flex-col items-center text-center px-4 relative group"
              >
                <div className="w-14 h-14 rounded-full bg-secondary border-2 border-border/60 flex items-center justify-center mb-5 group-hover:border-primary/60 group-hover:bg-primary/10 transition-smooth relative z-10">
                  <span className="font-display font-bold text-primary text-sm">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2 text-sm leading-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden space-y-0 relative">
            {/* Vertical line */}
            <div
              className="absolute left-7 top-7 bottom-7 w-px bg-border/40"
              aria-hidden="true"
            />

            {STEPS.map((s, i) => (
              <div
                key={s.num}
                data-ocid={`how_to_join.step.${i + 1}`}
                className="flex gap-5 pb-8 relative group"
              >
                <div className="w-14 h-14 rounded-full bg-secondary border-2 border-border/60 flex items-center justify-center shrink-0 group-hover:border-primary/60 group-hover:bg-primary/10 transition-smooth relative z-10">
                  <span className="font-display font-bold text-primary text-sm">
                    {s.num}
                  </span>
                </div>
                <div className="pt-3 flex-1">
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/apply" data-ocid="how_to_join.apply_button">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-10 py-4 h-auto transition-smooth shadow-luxury group"
              >
                Start Your Journey — ₹1499
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Project Gallery ────────────────────────────────────────── */}
      <section
        className="py-24 bg-card border-y border-border/30"
        id="gallery"
        data-ocid="gallery.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary bg-primary/5 text-xs tracking-widest uppercase px-4 py-1"
            >
              Our Work
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Project Gallery
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hamari top shoots — fashion, jewellery, bridal aur bahut kuch
            </p>
          </div>

          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {GALLERY_ITEMS.map((item, i) => (
              <div
                key={item.label}
                data-ocid={`gallery.item.${i + 1}`}
                className={`${item.aspect} relative overflow-hidden rounded-sm border border-border/30 group cursor-default break-inside-avoid hover:border-primary/50 transition-smooth shadow-card`}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${GALLERY_GRADIENTS[i]} min-h-[140px]`}
                />
                {/* Shimmer hover effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 animate-gold-shimmer opacity-20" />
                  <div className="absolute inset-x-0 top-0 h-px bg-primary/50" />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-primary/50" />
                </div>
                {/* Label overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-background/90 via-background/50 to-transparent">
                  <p className="text-xs font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ────────────────────────────────────────── */}
      <ContactSection />

      {/* ── Legal Disclaimer ───────────────────────────────────────── */}
      <section className="py-16 bg-background" data-ocid="disclaimer.section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible data-ocid="disclaimer.accordion">
            <AccordionItem
              value="disclaimer"
              className="border border-border/40 rounded-sm overflow-hidden bg-card"
            >
              <AccordionTrigger
                className="px-6 py-4 hover:no-underline group"
                data-ocid="disclaimer.toggle"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">
                      Important Disclaimer — Pehle Padhe
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Registration ke pehle yeh zaroor padhe
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent data-ocid="disclaimer.content">
                <div className="px-6 pb-6 pt-2 border-l-4 border-primary/40 ml-6">
                  <ul className="space-y-3">
                    {[
                      "₹1499 onboarding fee sirf verification & profile setup ke liye hai.",
                      "Ye fee job guarantee nahi deta. Selection client requirements par depend karta hai.",
                      "Selection ke baad 20% advance payment mil sakta hai.",
                      "Remaining payment shoot completion ke baad clear hota hai.",
                      "Dream Capture India ek legitimate casting agency hai — koi hidden charges nahi hain.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Trust badges row */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { Icon: ShieldCheck, text: "Verified Platform" },
              { Icon: Star, text: "Premium Quality" },
              { Icon: CheckCircle2, text: "Transparent Process" },
            ].map(({ Icon: TrustIcon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-xs text-muted-foreground/60"
              >
                <TrustIcon className="w-3.5 h-3.5 text-primary/40" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA Banner ───────────────────────────────────────── */}
      <section
        className="py-16 bg-secondary/30 border-t border-border/40"
        data-ocid="final_cta.section"
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Apna Dream Shuru Karo Aaj
          </h2>
          <p className="text-muted-foreground mb-8">
            Sirf ₹1499 mein apna profile banao aur India ke top brands ke liye
            casting mein participate karo
          </p>
          <Link to="/apply" data-ocid="final_cta.apply_button">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-12 py-4 h-auto transition-smooth shadow-luxury group text-base"
            >
              Register Now — ₹1499
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
