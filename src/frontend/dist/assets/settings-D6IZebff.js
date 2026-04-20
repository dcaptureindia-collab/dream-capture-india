import { c as useQueryClient, r as reactExports, j as jsxRuntimeExports, a as ue } from "./index-CebTjiTu.js";
import { A as AdminLayout, S as Settings } from "./AdminLayout-B_Ai7nyX.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, B as Button } from "./x-CNxy1RBN.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CzpBPjzC.js";
import { I as Input } from "./input-CO01C1BR.js";
import { L as Label } from "./label-DvMKma_3.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import { D as DollarSign } from "./dollar-sign-DZmTDZzu.js";
import { P as Phone } from "./phone-BUpYnJh3.js";
import { M as Mail } from "./mail-P6-bKmNo.js";
import { I as Instagram } from "./instagram-BK2cHbHf.js";
import { C as CreditCard } from "./credit-card-DXqusCYa.js";
import { S as Save } from "./save-D_LOzxud.js";
import "./shield-DbgbHF9g.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
function FieldRow({
  icon: Icon,
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5 text-primary" }),
      label
    ] }),
    children
  ] });
}
function AdminSettingsPage() {
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const [config, setConfig] = reactExports.useState({
    stripePublicKey: "",
    paymentAmountDisplay: "1499",
    whatsappNumber: "",
    email: "",
    instagramHandle: ""
  });
  const { data: remoteConfig, isLoading: configLoading } = useQuery({
    queryKey: ["admin", "config"],
    queryFn: () => actor.getConfig(),
    enabled: !!actor && !actorLoading
  });
  reactExports.useEffect(() => {
    if (remoteConfig) {
      setConfig({
        stripePublicKey: remoteConfig.stripePublicKey,
        paymentAmountDisplay: String(Number(remoteConfig.paymentAmount) / 100),
        whatsappNumber: remoteConfig.whatsappNumber,
        email: remoteConfig.email,
        instagramHandle: remoteConfig.instagramHandle
      });
    }
  }, [remoteConfig]);
  const updateMutation = useMutation({
    mutationFn: (newConfig) => actor.updateConfig(newConfig),
    onSuccess: () => {
      ue.success("Configuration saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "config"] });
    },
    onError: () => ue.error("Failed to save configuration.")
  });
  const handleChange = (e) => {
    setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSave = (e) => {
    e.preventDefault();
    const amountNum = Number.parseFloat(config.paymentAmountDisplay);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      ue.error("Please enter a valid payment amount.");
      return;
    }
    const newConfig = {
      stripePublicKey: config.stripePublicKey,
      paymentAmount: BigInt(Math.round(amountNum * 100)),
      whatsappNumber: config.whatsappNumber,
      email: config.email,
      instagramHandle: config.instagramHandle
    };
    updateMutation.mutate(newConfig);
  };
  const isLoading = configLoading || actorLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-2xl", "data-ocid": "admin_settings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Centralized configuration for Dream Capture India" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "admin_settings.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4 text-primary" }),
          "Platform Configuration"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldRow, { icon: DollarSign, label: "Onboarding Fee (₹)", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm", children: "₹" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "paymentAmountDisplay",
                  name: "paymentAmountDisplay",
                  type: "number",
                  min: "1",
                  step: "1",
                  value: config.paymentAmountDisplay,
                  onChange: handleChange,
                  placeholder: "1499",
                  className: "bg-input border-border/50 pl-7",
                  "data-ocid": "admin_settings.payment_amount_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
              "Stored as paise internally (₹",
              config.paymentAmountDisplay,
              " =",
              " ",
              Math.round(
                Number.parseFloat(config.paymentAmountDisplay || "0") * 100
              ),
              " ",
              "paise)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { icon: Phone, label: "WhatsApp Number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "whatsappNumber",
              name: "whatsappNumber",
              value: config.whatsappNumber,
              onChange: handleChange,
              placeholder: "+919999999999",
              className: "bg-input border-border/50",
              "data-ocid": "admin_settings.whatsapp_input"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { icon: Mail, label: "Contact Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "email",
              name: "email",
              type: "email",
              value: config.email,
              onChange: handleChange,
              placeholder: "contact@dreamcaptureindia.com",
              className: "bg-input border-border/50",
              "data-ocid": "admin_settings.email_input"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { icon: Instagram, label: "Instagram Handle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "instagramHandle",
              name: "instagramHandle",
              value: config.instagramHandle,
              onChange: handleChange,
              placeholder: "@dreamcaptureindia",
              className: "bg-input border-border/50",
              "data-ocid": "admin_settings.instagram_input"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
          "Stripe Payment Configuration"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldRow, { icon: CreditCard, label: "Stripe Public Key", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "stripePublicKey",
              name: "stripePublicKey",
              value: config.stripePublicKey,
              onChange: handleChange,
              placeholder: "pk_live_...",
              className: "bg-input border-border/50 font-mono text-sm",
              "data-ocid": "admin_settings.stripe_public_key_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
            "Only the public key is stored here. Secret key is managed separately."
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          disabled: updateMutation.isPending,
          className: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold min-w-36",
          "data-ocid": "admin_settings.save_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2" }),
            updateMutation.isPending ? "Saving..." : "Save All Settings"
          ]
        }
      ) }),
      updateMutation.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-3 bg-green-500/10 border border-green-500/30 rounded-sm",
          "data-ocid": "admin_settings.success_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-600 font-medium", children: "✓ Configuration saved and applied." })
        }
      )
    ] })
  ] }) });
}
export {
  AdminSettingsPage
};
