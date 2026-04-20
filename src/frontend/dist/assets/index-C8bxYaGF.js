import { c as useQueryClient, r as reactExports, j as jsxRuntimeExports, L as Link, a as ue } from "./index-CebTjiTu.js";
import { R as RegistrationStatus, P as PaymentStatus } from "./backend.d-DcSV0aLA.js";
import { A as AdminLayout, U as Users } from "./AdminLayout-B_Ai7nyX.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Ddh4idmz.js";
import { B as Badge } from "./badge-Bz0HIF4P.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, B as Button } from "./x-CNxy1RBN.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CzpBPjzC.js";
import { I as Input } from "./input-CO01C1BR.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import { E as Eye } from "./eye-BCyYI8wK.js";
import { C as CircleCheck } from "./circle-check-CcVaUi-L.js";
import { C as CircleX } from "./circle-x-BGq9IcKP.js";
import "./shield-DbgbHF9g.js";
import "./index-BIROJ8_8.js";
import "./index-YKGae6c9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-xs ${m.cls}`, children: m.label });
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
      label: "Verified",
      cls: "bg-green-500/15 text-green-600 border-green-500/30"
    }
  };
  const m = map[status] ?? map[PaymentStatus.NotPaid];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-xs ${m.cls}`, children: m.label });
}
const FILTERS = ["All", "Pending", "Approved", "Rejected"];
function AdminCandidatesPage() {
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("All");
  const [confirmAction, setConfirmAction] = reactExports.useState(null);
  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["admin", "candidates"],
    queryFn: () => actor.listAllCandidates(),
    enabled: !!actor && !actorLoading
  });
  const approveMutation = useMutation({
    mutationFn: (id) => actor.approveCandidate(id),
    onSuccess: () => {
      ue.success("Candidate approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
    onError: () => ue.error("Failed to approve candidate.")
  });
  const rejectMutation = useMutation({
    mutationFn: (id) => actor.rejectCandidate(id),
    onSuccess: () => {
      ue.success("Candidate rejected.");
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
    onError: () => ue.error("Failed to reject candidate.")
  });
  const filtered = candidates.filter((c) => {
    const matchesSearch = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || filter === "Pending" && c.registrationStatus === RegistrationStatus.Pending || filter === "Approved" && c.registrationStatus === RegistrationStatus.Approved || filter === "Rejected" && c.registrationStatus === RegistrationStatus.Rejected;
    return matchesSearch && matchesFilter;
  });
  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") {
      approveMutation.mutate(confirmAction.candidate.principalId);
    } else {
      rejectMutation.mutate(confirmAction.candidate.principalId);
    }
    setConfirmAction(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_candidates.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Candidates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Manage and review all registered candidates" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Search by name or email...",
              className: "pl-9 bg-input border-border/50",
              "data-ocid": "admin_candidates.search_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: filter === f ? "default" : "outline",
            size: "sm",
            onClick: () => setFilter(f),
            className: filter === f ? "bg-primary text-primary-foreground" : "border-border/50 hover:border-primary/30",
            "data-ocid": `admin_candidates.filter_${f.toLowerCase()}_tab`,
            children: [
              f,
              f !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-xs opacity-70", children: [
                "(",
                candidates.filter(
                  (c) => c.registrationStatus === RegistrationStatus[f]
                ).length,
                ")"
              ] })
            ]
          },
          f
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-primary" }),
          filter === "All" ? "All Candidates" : `${filter} Candidates`,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-sm", children: [
            "(",
            filtered.length,
            ")"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-16 flex flex-col items-center gap-3 text-muted-foreground",
            "data-ocid": "admin_candidates.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 text-primary/20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No candidates found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "Try adjusting your search or filter." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs text-muted-foreground font-medium", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs text-muted-foreground font-medium", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell", children: "City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs text-muted-foreground font-medium", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs text-muted-foreground font-medium", children: "Payment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell", children: "Portfolio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs text-muted-foreground font-medium", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/30 hover:bg-muted/10 transition-colors",
              "data-ocid": `admin_candidates.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground truncate max-w-[120px]", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-[150px]", children: c.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell", children: c.phone }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell", children: c.city }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: regBadge(c.registrationStatus) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: payBadge(c.paymentStatus) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-muted-foreground hidden md:table-cell", children: c.portfolioImages.length }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/admin/candidates/$candidateId",
                      params: { candidateId: c.principalId.toString() },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-muted-foreground hover:text-primary",
                          "aria-label": "View candidate",
                          "data-ocid": `admin_candidates.view_button.${i + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" })
                        }
                      )
                    }
                  ),
                  c.registrationStatus === RegistrationStatus.Pending && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        className: "h-7 w-7 text-green-600 hover:bg-green-500/10",
                        "aria-label": "Approve candidate",
                        onClick: () => setConfirmAction({
                          type: "approve",
                          candidate: c
                        }),
                        "data-ocid": `admin_candidates.approve_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        className: "h-7 w-7 text-destructive hover:bg-destructive/10",
                        "aria-label": "Reject candidate",
                        onClick: () => setConfirmAction({
                          type: "reject",
                          candidate: c
                        }),
                        "data-ocid": `admin_candidates.reject_button.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] })
                ] }) })
              ]
            },
            c.principalId.toString()
          )) })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!confirmAction,
        onOpenChange: (open) => !open && setConfirmAction(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "bg-card border-border/50",
            "data-ocid": "admin_candidates.confirm_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-foreground", children: (confirmAction == null ? void 0 : confirmAction.type) === "approve" ? "Approve Candidate?" : "Reject Candidate?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: (confirmAction == null ? void 0 : confirmAction.type) === "approve" ? `"${confirmAction == null ? void 0 : confirmAction.candidate.name}" ko approve karna chahte hain?` : `"${confirmAction == null ? void 0 : confirmAction.candidate.name}" ko reject karna chahte hain? Ye action reverse ki ja sakti hai.` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "admin_candidates.confirm_cancel_button", children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: handleConfirm,
                    className: (confirmAction == null ? void 0 : confirmAction.type) === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-destructive hover:bg-destructive/90",
                    "data-ocid": "admin_candidates.confirm_button",
                    children: (confirmAction == null ? void 0 : confirmAction.type) === "approve" ? "Approve" : "Reject"
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
  AdminCandidatesPage
};
