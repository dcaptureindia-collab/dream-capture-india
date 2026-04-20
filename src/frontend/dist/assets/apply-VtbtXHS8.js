import { u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, a as ue } from "./index-CebTjiTu.js";
import { c as createLucideIcon, e as useActor, C as Crown, B as Button, f as createActor } from "./x-CNxy1RBN.js";
import { P as PublicLayout } from "./PublicLayout-B6kI6DgX.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import { C as CircleCheck } from "./circle-check-CcVaUi-L.js";
import { A as ArrowRight } from "./arrow-right-DcR4w7M6.js";
import { S as Shield } from "./shield-DbgbHF9g.js";
import "./message-circle-DnRjIU2c.js";
import "./mail-P6-bKmNo.js";
import "./instagram-BK2cHbHf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const INCLUSIONS = [
  {
    text: "Profile Setup & Verification",
    desc: "Professional profile on the platform"
  },
  {
    text: "Portfolio Creation Support",
    desc: "Upload up to 10 high-quality images"
  },
  {
    text: "Access to Premium Projects",
    desc: "Fashion, bridal, web series & more"
  },
  {
    text: "Admin Review & Onboarding",
    desc: "Expert team reviews your application"
  },
  {
    text: "Candidate Dashboard Access",
    desc: "Real-time casting updates & notifications"
  },
  {
    text: "WhatsApp Registration Confirmation",
    desc: "Instant confirmation on payment"
  }
];
function ApplyPage() {
  const { actor } = useActor(createActor);
  const { isAuthenticated, login, isInitializing, isLoggingIn } = useInternetIdentity();
  const [error, setError] = reactExports.useState(null);
  const checkout = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/payment/failed`;
      const result = await actor.createCheckoutSession(successUrl, cancelUrl);
      const session = JSON.parse(result);
      if (!(session == null ? void 0 : session.url)) throw new Error("Stripe session missing url");
      return session;
    },
    onSuccess: (session) => {
      window.location.href = session.url;
    },
    onError: (err) => {
      setError(err.message ?? "Payment initiation failed. Please try again.");
      ue.error("Payment failed to initiate. Please try again.");
    }
  });
  const handlePay = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setError(null);
    checkout.mutate();
  };
  const isLoading = isInitializing || isLoggingIn || checkout.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl w-full space-y-8", "data-ocid": "apply.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-8 h-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 text-primary-foreground" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-[0.25em] uppercase text-primary/70 font-body mb-2", children: "Dream Capture India" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight", children: [
          "Begin Your Modelling",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Journey Today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 text-sm leading-relaxed", children: "India's premier casting platform connecting talented models with top brands, designers & production houses." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-primary/25 rounded-sm overflow-hidden shadow-luxury",
        "data-ocid": "apply.fee_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/80 border-b border-primary/20 px-6 py-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-[0.2em] uppercase text-primary/60 font-body", children: "One-time Onboarding Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-primary mt-0.5", children: "₹1499" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Registration &" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Profile Setup" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 uppercase tracking-widest mb-4", children: "What's Included" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: INCLUSIONS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: item.text }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70", children: item.desc })
              ] })
            ] }, item.text)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6 space-y-3", children: [
            error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-sm text-destructive",
                "data-ocid": "apply.error_state",
                children: error
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "lg",
                className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base transition-smooth shadow-luxury h-12",
                onClick: handlePay,
                disabled: isLoading,
                "data-ocid": "apply.pay_button",
                children: [
                  isInitializing || isLoggingIn ? "Authenticating..." : checkout.isPending ? "Redirecting to Payment..." : !isAuthenticated ? "Login & Pay ₹1499" : "Pay ₹1499 & Start Your Journey",
                  !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                ]
              }
            ),
            !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 text-center", children: "You'll be asked to login with Internet Identity before proceeding to payment" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2.5 p-4 bg-muted/40 border border-border/50 rounded-sm",
        "data-ocid": "apply.disclaimer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 shrink-0 mt-0.5 text-muted-foreground/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/60 leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-muted-foreground/80 font-medium", children: "Important Disclaimer:" }),
            " ",
            "₹1499 onboarding fee is for verification & profile setup only. It does not guarantee job placement or casting selection. Shortlisting is based on client requirements. Post selection, 20% advance may be paid with remainder on shoot completion."
          ] })
        ]
      }
    )
  ] }) }) });
}
export {
  ApplyPage
};
