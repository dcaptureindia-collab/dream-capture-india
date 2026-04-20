import { f as useParams, c as useQueryClient, r as reactExports, P as Principal, j as jsxRuntimeExports, L as Link, a as ue } from "./index-CebTjiTu.js";
import { R as RegistrationStatus, P as PaymentStatus } from "./backend.d-DcSV0aLA.js";
import { A as AdminLayout } from "./AdminLayout-B_Ai7nyX.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Ddh4idmz.js";
import { B as Badge } from "./badge-Bz0HIF4P.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, B as Button } from "./x-CNxy1RBN.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CzpBPjzC.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import { A as ArrowLeft } from "./arrow-left-Bm6QnXww.js";
import { U as User } from "./user-CLcws5yd.js";
import { C as CircleX } from "./circle-x-BGq9IcKP.js";
import { C as CircleCheck } from "./circle-check-CcVaUi-L.js";
import { M as Mail } from "./mail-P6-bKmNo.js";
import { P as Phone } from "./phone-BUpYnJh3.js";
import { C as Clock } from "./clock-DH-P6xGA.js";
import { C as Camera } from "./camera-B90MxO0v.js";
import { I as Image } from "./image-BwURnjpr.js";
import "./shield-DbgbHF9g.js";
import "./index-BIROJ8_8.js";
import "./index-YKGae6c9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$1);
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
      d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
      key: "icamh8"
    }
  ],
  ["path", { d: "m14.5 12.5 2-2", key: "inckbg" }],
  ["path", { d: "m11.5 9.5 2-2", key: "fmmyf7" }],
  ["path", { d: "m8.5 6.5 2-2", key: "vc6u1g" }],
  ["path", { d: "m17.5 15.5 2-2", key: "wo5hmg" }]
];
const Ruler = createLucideIcon("ruler", __iconNode);
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function regBadge(status) {
  const map = {
    [RegistrationStatus.Pending]: {
      label: "Pending",
      cls: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30"
    },
    [RegistrationStatus.Approved]: {
      label: "Approved",
      cls: "bg-green-500/15 text-green-600 border-green-500/30"
    },
    [RegistrationStatus.Rejected]: {
      label: "Rejected",
      cls: "bg-destructive/15 text-destructive border-destructive/30"
    },
    [RegistrationStatus.Suspended]: {
      label: "Suspended",
      cls: "bg-muted text-muted-foreground border-border"
    }
  };
  const m = map[status] ?? map[RegistrationStatus.Pending];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `${m.cls}`, children: m.label });
}
function payBadge(status) {
  const map = {
    [PaymentStatus.NotPaid]: {
      label: "Not Paid",
      cls: "bg-muted text-muted-foreground border-border"
    },
    [PaymentStatus.Paid]: {
      label: "Paid",
      cls: "bg-blue-500/15 text-blue-600 border-blue-500/30"
    },
    [PaymentStatus.Verified]: {
      label: "Verified ✓",
      cls: "bg-green-500/15 text-green-600 border-green-500/30"
    }
  };
  const m = map[status] ?? map[PaymentStatus.NotPaid];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `${m.cls}`, children: m.label });
}
function DetailRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-border/30 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground sm:w-36 shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-medium", children: value })
  ] });
}
function AdminCandidateDetailPage() {
  const { candidateId } = useParams({ strict: false });
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const [confirmAction, setConfirmAction] = reactExports.useState(null);
  const principalObj = (() => {
    try {
      return Principal.fromText(candidateId);
    } catch {
      return null;
    }
  })();
  const { data: candidate, isLoading } = useQuery({
    queryKey: ["admin", "candidate", candidateId],
    queryFn: () => actor.getCandidateDetail(principalObj),
    enabled: !!actor && !actorLoading && !!principalObj
  });
  const approveMutation = useMutation({
    mutationFn: () => actor.approveCandidate(principalObj),
    onSuccess: () => {
      ue.success("Candidate approved!");
      queryClient.invalidateQueries({
        queryKey: ["admin", "candidate", candidateId]
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
    onError: () => ue.error("Failed to approve candidate.")
  });
  const rejectMutation = useMutation({
    mutationFn: () => actor.rejectCandidate(principalObj),
    onSuccess: () => {
      ue.success("Candidate rejected.");
      queryClient.invalidateQueries({
        queryKey: ["admin", "candidate", candidateId]
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
    onError: () => ue.error("Failed to reject candidate.")
  });
  const handleConfirm = () => {
    if (confirmAction === "approve") approveMutation.mutate();
    else if (confirmAction === "reject") rejectMutation.mutate();
    setConfirmAction(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-6 max-w-4xl",
        "data-ocid": "admin_candidate_detail.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/admin/candidates",
              className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit",
              "data-ocid": "admin_candidate_detail.back_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Back to Candidates"
              ]
            }
          ),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "admin_candidate_detail.loading_state",
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" })
              ]
            }
          ) : !candidate ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-20 text-muted-foreground",
              "data-ocid": "admin_candidate_detail.error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-10 h-10 text-primary/20 mx-auto mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Candidate not found" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mt-1", children: [
                  "ID: ",
                  candidateId
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: candidate.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 font-mono break-all", children: candidateId }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                  regBadge(candidate.registrationStatus),
                  payBadge(candidate.paymentStatus)
                ] })
              ] }),
              candidate.registrationStatus === RegistrationStatus.Pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "border-destructive/30 text-destructive hover:bg-destructive/10",
                    onClick: () => setConfirmAction("reject"),
                    "data-ocid": "admin_candidate_detail.reject_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 mr-1.5" }),
                      "Reject"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    className: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
                    onClick: () => setConfirmAction("approve"),
                    "data-ocid": "admin_candidate_detail.approve_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 mr-1.5" }),
                      "Approve"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary" }),
                "Personal Information"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid sm:grid-cols-2 gap-x-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Full Name", value: candidate.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      label: "Email",
                      value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3 text-muted-foreground" }),
                        candidate.email
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      label: "Phone",
                      value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3 text-muted-foreground" }),
                        candidate.phone
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      label: "City",
                      value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-muted-foreground" }),
                        candidate.city
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Age", value: `${candidate.age} years` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      label: "Height",
                      value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Ruler, { className: "w-3 h-3 text-muted-foreground" }),
                        candidate.height
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      label: "Measurements",
                      value: candidate.measurements || "—"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DetailRow,
                    {
                      label: "Registered",
                      value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-muted-foreground" }),
                        formatDate(candidate.createdAt)
                      ] })
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }),
                "Payment Verification"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                payBadge(candidate.paymentStatus),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: candidate.paymentStatus === PaymentStatus.Verified ? "Payment verified. Candidate is eligible for projects." : candidate.paymentStatus === PaymentStatus.Paid ? "Payment received, awaiting verification." : "Onboarding fee not paid yet." })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-4 h-4 text-primary" }),
                "Portfolio Images",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-sm", children: [
                  "(",
                  candidate.portfolioImages.length,
                  ")"
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: candidate.portfolioImages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-center py-10 text-muted-foreground/60 flex flex-col items-center gap-2",
                  "data-ocid": "admin_candidate_detail.portfolio_empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-8 h-8 text-primary/20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No portfolio images uploaded yet." })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: candidate.portfolioImages.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "aspect-[3/4] rounded-sm overflow-hidden bg-muted border border-border/30",
                  "data-ocid": `admin_candidate_detail.portfolio_image.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: img.getDirectURL(),
                      alt: `Portfolio ${i + 1} - ${candidate.name}`,
                      className: "w-full h-full object-cover",
                      loading: "lazy"
                    }
                  )
                },
                img.getDirectURL()
              )) }) })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!confirmAction,
        onOpenChange: (open) => !open && setConfirmAction(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "bg-card border-border/50",
            "data-ocid": "admin_candidate_detail.confirm_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-foreground", children: confirmAction === "approve" ? "Approve Candidate?" : "Reject Candidate?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: confirmAction === "approve" ? "Is candidate ko approve karein? Unhe projects assign kiye ja sakte hain." : "Is candidate ko reject karein? Ye decision baad mein change ki ja sakti hai." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "admin_candidate_detail.cancel_button", children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: handleConfirm,
                    className: confirmAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-destructive hover:bg-destructive/90",
                    "data-ocid": "admin_candidate_detail.confirm_button",
                    children: confirmAction === "approve" ? "Approve" : "Reject"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  AdminCandidateDetailPage
};
