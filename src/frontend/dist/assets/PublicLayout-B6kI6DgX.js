import { r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-CebTjiTu.js";
import { b as useBackend, d as useQuery, C as Crown, B as Button, X, M as Menu } from "./x-CNxy1RBN.js";
import { M as MessageCircle } from "./message-circle-DnRjIU2c.js";
import { M as Mail } from "./mail-P6-bKmNo.js";
import { I as Instagram } from "./instagram-BK2cHbHf.js";
const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Benefits", href: "#benefits" },
  { label: "How to Join", href: "#how-to-join" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" }
];
function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const { actor, isLoading: actorLoading } = useBackend();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : ""
  );
  const { data: config } = useQuery({
    queryKey: ["config"],
    queryFn: () => actor.getConfig(),
    enabled: !!actor && !actorLoading
  });
  const whatsappNumber = (config == null ? void 0 : config.whatsappNumber) ?? "919999999999";
  const email = (config == null ? void 0 : config.email) ?? "contact@dreamcaptureindia.com";
  const instagramHandle = (config == null ? void 0 : config.instagramHandle) ?? "dreamcaptureindia";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "fixed top-0 left-0 right-0 z-50 bg-card border-b border-border/50 shadow-luxury", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            className: "flex items-center gap-2 group",
            "data-ocid": "nav.logo_link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5 text-primary transition-smooth group-hover:scale-110" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold text-primary tracking-wide", children: "Dream Capture India" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "nav",
          {
            className: "hidden md:flex items-center gap-6",
            "aria-label": "Main navigation",
            children: NAV_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: link.href,
                className: "text-sm text-muted-foreground hover:text-foreground transition-colors duration-200",
                "data-ocid": `nav.${link.label.toLowerCase().replace(/\s+/g, "_")}_link`,
                children: link.label
              },
              link.href
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/candidate/dashboard", "data-ocid": "nav.member_login_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "text-muted-foreground hover:text-foreground text-sm",
              children: "Member Login"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/apply", "data-ocid": "nav.apply_now_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-smooth px-5",
              children: "Apply Now"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "md:hidden w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
            onClick: () => setMobileOpen((prev) => !prev),
            "aria-label": mobileOpen ? "Close menu" : "Open menu",
            "aria-expanded": mobileOpen,
            "data-ocid": "nav.hamburger_toggle",
            children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
          }
        )
      ] }) }),
      mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "md:hidden bg-card border-t border-border/50 px-4 py-5 space-y-1 shadow-luxury",
          "data-ocid": "nav.mobile_menu",
          children: [
            NAV_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: link.href,
                className: "block py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors",
                onClick: () => setMobileOpen(false),
                "data-ocid": `nav.mobile_${link.label.toLowerCase().replace(/\s+/g, "_")}_link`,
                children: link.label
              },
              link.href
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/candidate/dashboard",
                  onClick: () => setMobileOpen(false),
                  "data-ocid": "nav.mobile_login_link",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "w-full justify-start text-sm text-muted-foreground",
                      children: "Member Login"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/apply",
                  onClick: () => setMobileOpen(false),
                  "data-ocid": "nav.mobile_apply_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
                      children: "Apply Now — ₹1499"
                    }
                  )
                }
              )
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pt-16", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border/50 mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold text-primary", children: "Dream Capture India" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "India's premier luxury modelling & casting agency. We connect aspiring talent with elite brands and productions." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-sm font-semibold text-foreground tracking-widest uppercase", children: "Quick Links" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
            NAV_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: link.href,
                className: "text-sm text-muted-foreground hover:text-primary transition-colors duration-200",
                children: link.label
              }
            ) }, link.href)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/apply",
                className: "text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium",
                children: "Apply Now — ₹1499"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-sm font-semibold text-foreground tracking-widest uppercase", children: "Connect With Us" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://wa.me/${whatsappNumber}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200",
                "data-ocid": "footer.whatsapp_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" }),
                  "WhatsApp"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `mailto:${email}`,
                className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200",
                "data-ocid": "footer.email_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4" }),
                  "Email Us"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `https://instagram.com/${instagramHandle}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200",
                "data-ocid": "footer.instagram_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "w-4 h-4" }),
                  "Instagram"
                ]
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "© ",
          currentYear,
          " Dream Capture India. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Built with love using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-primary transition-colors duration-200",
              children: "caffeine.ai"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  PublicLayout as P
};
