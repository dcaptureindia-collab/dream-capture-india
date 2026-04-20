import { j as jsxRuntimeExports, L as Link } from "./index-CebTjiTu.js";
import { c as createLucideIcon, e as useActor, d as useQuery, B as Button, f as createActor } from "./x-CNxy1RBN.js";
import { P as PublicLayout } from "./PublicLayout-B6kI6DgX.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { C as CircleX } from "./circle-x-BGq9IcKP.js";
import { M as MessageCircle } from "./message-circle-DnRjIU2c.js";
import { A as ArrowRight } from "./arrow-right-DcR4w7M6.js";
import { M as Mail } from "./mail-P6-bKmNo.js";
import "./instagram-BK2cHbHf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "14sxne" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16", key: "1hlbsb" }],
  ["path", { d: "M16 16h5v5", key: "ccwih5" }]
];
const RefreshCcw = createLucideIcon("refresh-ccw", __iconNode);
function PaymentFailedPage() {
  const { actor } = useActor(createActor);
  const configQuery = useQuery({
    queryKey: ["appConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getConfig();
    },
    enabled: !!actor
  });
  const config = configQuery.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4",
      "data-ocid": "payment_failed.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full text-center space-y-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-destructive/10 border-2 border-destructive/25 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-12 h-12 text-destructive" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-[0.2em] uppercase text-muted-foreground/60 font-body", children: "Dream Capture India" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground", children: [
            "Payment Could Not Be",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "Processed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Aapka payment process nahi hua. Koi bank charge hua hai to 5–7 business days mein refund ho jayega." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-sm px-6 py-5 text-left space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 uppercase tracking-widest", children: "Common Reasons & Fixes" }),
          [
            {
              reason: "Card declined",
              fix: "Try a different card or check your bank limits"
            },
            {
              reason: "Insufficient funds",
              fix: "Ensure your account has at least ₹1499 balance"
            },
            {
              reason: "Session expired",
              fix: "Refresh and click the Pay button again"
            },
            {
              reason: "Network error",
              fix: "Check your internet connection and retry"
            }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground/80 font-medium", children: [
                item.reason,
                ":",
                " "
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: item.fix })
            ] })
          ] }, item.reason))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/apply", "data-ocid": "payment_failed.try_again_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "lg",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-4 h-4 mr-2" }),
                "Try Again"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", "data-ocid": "payment_failed.back_home_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "lg",
              className: "border-border/60",
              children: "Back to Home"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border/50 rounded-sm px-6 py-5 text-left space-y-3",
            "data-ocid": "payment_failed.support_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 uppercase tracking-widest", children: "Need Help? Contact Support" }),
              configQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                (config == null ? void 0 : config.whatsappNumber) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `https://wa.me/${config.whatsappNumber.replace(/\D/g, "")}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex items-center gap-3 p-3 bg-muted/40 border border-border/40 rounded-sm hover:border-primary/30 transition-smooth group",
                    "data-ocid": "payment_failed.whatsapp_link",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4 text-primary" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: "WhatsApp Support" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: config.whatsappNumber })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-muted-foreground/40 ml-auto shrink-0 group-hover:text-primary transition-smooth" })
                    ]
                  }
                ),
                (config == null ? void 0 : config.email) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `mailto:${config.email}`,
                    className: "flex items-center gap-3 p-3 bg-muted/40 border border-border/40 rounded-sm hover:border-primary/30 transition-smooth group",
                    "data-ocid": "payment_failed.email_link",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 text-primary" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: "Email Support" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: config.email })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 text-muted-foreground/40 ml-auto shrink-0 group-hover:text-primary transition-smooth" })
                    ]
                  }
                ),
                !(config == null ? void 0 : config.whatsappNumber) && !(config == null ? void 0 : config.email) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground/60", children: "Contact information unavailable. Please try again later." })
              ] })
            ]
          }
        )
      ] })
    }
  ) });
}
export {
  PaymentFailedPage
};
