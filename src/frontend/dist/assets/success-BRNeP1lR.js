import { b as useSearch, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-CebTjiTu.js";
import { e as useActor, d as useQuery, B as Button, C as Crown, f as createActor } from "./x-CNxy1RBN.js";
import { P as PublicLayout } from "./PublicLayout-B6kI6DgX.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import { L as LoaderCircle } from "./loader-circle-B0D6aYu_.js";
import { T as TriangleAlert } from "./triangle-alert-YD5YLFcG.js";
import { A as ArrowRight } from "./arrow-right-DcR4w7M6.js";
import { C as CircleCheck } from "./circle-check-CcVaUi-L.js";
import "./message-circle-DnRjIU2c.js";
import "./mail-P6-bKmNo.js";
import "./instagram-BK2cHbHf.js";
const REDIRECT_DELAY = 3;
function PaymentSuccessPage() {
  var _a, _b, _c;
  const { actor } = useActor(createActor);
  const search = useSearch({ strict: false });
  const sessionId = (search == null ? void 0 : search.session_id) ?? "";
  const [countdown, setCountdown] = reactExports.useState(REDIRECT_DELAY);
  const [redirected, setRedirected] = reactExports.useState(false);
  const countdownRef = reactExports.useRef(null);
  const statusQuery = useQuery({
    queryKey: ["stripeSessionStatus", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) throw new Error("Missing session");
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !!sessionId,
    retry: 2
  });
  const isVerified = ((_a = statusQuery.data) == null ? void 0 : _a.__kind__) === "completed";
  const isFailed = ((_b = statusQuery.data) == null ? void 0 : _b.__kind__) === "failed";
  const { mutate: recordMutate } = useMutation({
    mutationFn: async () => {
      if (!actor || !sessionId) throw new Error("Missing actor or session");
      return actor.recordPayment(sessionId);
    }
  });
  const recordCalledRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (isVerified && !recordCalledRef.current) {
      recordCalledRef.current = true;
      recordMutate();
    }
  }, [isVerified, recordMutate]);
  reactExports.useEffect(() => {
    if (!isVerified) return;
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setRedirected(true);
          window.location.href = "/candidate/profile";
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isVerified]);
  if (statusQuery.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4",
        "data-ocid": "payment_success.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full text-center space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-9 h-9 text-primary animate-spin" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64 mx-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48 mx-auto" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Verifying your payment…" })
        ] })
      }
    ) });
  }
  if (isFailed || !sessionId && !statusQuery.isLoading) {
    const errMsg = ((_c = statusQuery.data) == null ? void 0 : _c.__kind__) === "failed" ? statusQuery.data.failed.error : "Session ID is missing. Payment could not be verified.";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4",
        "data-ocid": "payment_success.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full text-center space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-destructive/10 border border-destructive/20 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-9 h-9 text-destructive" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Verification Failed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: errMsg })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/apply", "data-ocid": "payment_success.retry_link", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "lg",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-smooth",
              children: [
                "Try Again ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
              ]
            }
          ) }) })
        ] })
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4",
      "data-ocid": "payment_success.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full text-center space-y-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-primary/10 border-2 border-primary/40 rounded-full flex items-center justify-center shadow-luxury", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-12 h-12 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 text-primary-foreground" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-[0.2em] uppercase text-primary/70 font-body", children: "Dream Capture India" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-bold text-foreground", children: "Payment Successful!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display text-primary", children: "₹1499 Verified ✓" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/20 rounded-sm px-6 py-5 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-base", children: "Welcome to Dream Capture India!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Aapka registration successful raha. Ab apna profile complete karein." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-sm p-5 text-left space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 uppercase tracking-widest mb-1", children: "Next Steps" }),
          [
            "Complete your candidate profile",
            "Upload your portfolio images",
            "WhatsApp confirmation will be sent shortly",
            "Our team will review and onboard you"
          ].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2.5 text-sm text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: step })
              ]
            },
            step
          ))
        ] }),
        !redirected && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "text-sm text-muted-foreground",
            "data-ocid": "payment_success.redirect_countdown",
            children: [
              "Redirecting to your profile in",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary", children: [
                countdown,
                "s"
              ] }),
              "…"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/candidate/profile",
              "data-ocid": "payment_success.go_to_profile_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "lg",
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-smooth",
                  children: [
                    "Complete Profile ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/candidate/dashboard",
              "data-ocid": "payment_success.go_to_dashboard_link",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "lg",
                  className: "border-border/60",
                  children: "Go to Dashboard"
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/50", children: [
          "If the redirect doesn't happen,",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/candidate/profile",
              className: "underline text-primary/70 hover:text-primary transition-colors",
              "data-ocid": "payment_success.manual_redirect_link",
              children: "click here"
            }
          ),
          " ",
          "to go to your profile."
        ] })
      ] })
    }
  ) });
}
export {
  PaymentSuccessPage
};
