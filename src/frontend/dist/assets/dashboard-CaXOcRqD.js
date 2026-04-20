import { u as useInternetIdentity, e as useNavigate, j as jsxRuntimeExports, L as Link } from "./index-CebTjiTu.js";
import { P as PaymentStatus, R as RegistrationStatus, a as ProjectStatus } from "./backend.d-DcSV0aLA.js";
import { A as AdminLayout, U as Users } from "./AdminLayout-B_Ai7nyX.js";
import { B as Badge } from "./badge-Bz0HIF4P.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, B as Button } from "./x-CNxy1RBN.js";
import { d as Bell, B as Briefcase, C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CzpBPjzC.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { S as Shield } from "./shield-DbgbHF9g.js";
import { A as ArrowRight } from "./arrow-right-DcR4w7M6.js";
import { C as CreditCard } from "./credit-card-DXqusCYa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode);
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatAmount(amount) {
  return `₹${(Number(amount) / 100).toLocaleString("en-IN")}`;
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
function AdminDashboardPage() {
  const { isAuthenticated, login, isInitializing } = useInternetIdentity();
  const { actor, isLoading: actorLoading } = useBackend();
  const navigate = useNavigate();
  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ["admin", "candidates"],
    queryFn: () => actor.listAllCandidates(),
    enabled: !!actor && !actorLoading && isAuthenticated
  });
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => actor.listProjects(),
    enabled: !!actor && !actorLoading && isAuthenticated
  });
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: () => actor.listPayments(),
    enabled: !!actor && !actorLoading && isAuthenticated
  });
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center h-64",
        "data-ocid": "admin_dashboard.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground animate-pulse", children: "Loading..." })
      }
    ) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-64 gap-4 text-center",
        "data-ocid": "admin_dashboard.auth_required",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-10 h-10 text-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Admin Login Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm text-sm", children: "Admin panel access karne ke liye login karein." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: login,
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              "data-ocid": "admin_dashboard.login_button",
              children: "Login with Internet Identity"
            }
          )
        ]
      }
    ) });
  }
  const totalApplicants = candidates.length;
  const paymentVerified = candidates.filter(
    (c) => c.paymentStatus === PaymentStatus.Verified
  ).length;
  const pendingApprovals = candidates.filter(
    (c) => c.registrationStatus === RegistrationStatus.Pending
  ).length;
  const activeProjects = projects.filter(
    (p) => p.status === ProjectStatus.Active
  ).length;
  const recentCandidates = [...candidates].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 5);
  const recentPayments = [...payments].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 5);
  const STATS = [
    {
      label: "Total Applicants",
      value: String(totalApplicants),
      icon: Users,
      href: "/admin/candidates",
      ocid: "admin_dashboard.total_applicants_card"
    },
    {
      label: "Payment Verified",
      value: String(paymentVerified),
      icon: CircleCheckBig,
      href: "/admin/candidates",
      ocid: "admin_dashboard.payment_verified_card"
    },
    {
      label: "Pending Approvals",
      value: String(pendingApprovals),
      icon: Bell,
      href: "/admin/candidates",
      ocid: "admin_dashboard.pending_approvals_card"
    },
    {
      label: "Active Projects",
      value: String(activeProjects),
      icon: Briefcase,
      href: "/admin/projects",
      ocid: "admin_dashboard.active_projects_card"
    }
  ];
  const isLoading = candidatesLoading || projectsLoading || paymentsLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Admin Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Dream Capture India — Control Room" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: STATS.map((stat) => {
      const Icon = stat.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: stat.href, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "bg-card border-border/50 hover:border-primary/30 transition-smooth group cursor-pointer",
          "data-ocid": stat.ocid,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: stat.label }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-12" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: stat.value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }) })
          ] }) })
        }
      ) }, stat.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-primary" }),
            "Recent Applications"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/candidates", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "text-xs text-primary hover:text-primary/80",
              "data-ocid": "admin_dashboard.view_all_candidates_button",
              children: [
                "View All ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3 ml-1" })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: candidatesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) }) : recentCandidates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-center py-10 text-muted-foreground/60 text-sm",
            "data-ocid": "admin_dashboard.candidates_empty_state",
            children: "No candidates yet."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs text-muted-foreground font-medium", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs text-muted-foreground font-medium", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs text-muted-foreground font-medium", children: "Payment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2 text-xs text-muted-foreground font-medium", children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recentCandidates.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer",
              onClick: () => navigate({
                to: "/admin/candidates/$candidateId",
                params: { candidateId: c.principalId.toString() }
              }),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate({
                    to: "/admin/candidates/$candidateId",
                    params: {
                      candidateId: c.principalId.toString()
                    }
                  });
                }
              },
              tabIndex: 0,
              "data-ocid": `admin_dashboard.candidate_row.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground truncate max-w-[120px]", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: regBadge(c.registrationStatus) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: payBadge(c.paymentStatus) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-muted-foreground text-xs", children: formatDate(c.createdAt) })
              ]
            },
            c.principalId.toString()
          )) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "flex flex-row items-center justify-between pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
          "Recent Payments"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: paymentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) }) : recentPayments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-center py-10 text-muted-foreground/60 text-sm",
            "data-ocid": "admin_dashboard.payments_empty_state",
            children: "No payments yet."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs text-muted-foreground font-medium", children: "Payment ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2 text-xs text-muted-foreground font-medium", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 text-xs text-muted-foreground font-medium", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2 text-xs text-muted-foreground font-medium", children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recentPayments.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/30",
              "data-ocid": `admin_dashboard.payment_row.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-xs text-muted-foreground font-mono truncate max-w-[100px]", children: [
                  "#",
                  p.id.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-semibold text-foreground", children: formatAmount(p.amount) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs ${p.status === "Completed" ? "bg-green-500/15 text-green-600 border-green-500/30" : p.status === "Pending" ? "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" : "bg-destructive/15 text-destructive border-destructive/30"}`,
                    children: p.status
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right text-muted-foreground text-xs", children: formatDate(p.createdAt) })
              ]
            },
            p.id.toString()
          )) })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base text-foreground", children: "Quick Actions" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/admin/candidates",
            "data-ocid": "admin_dashboard.view_all_candidates_link",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                className: "border-border/50 hover:border-primary/30 text-sm gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                  " View All Candidates"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/admin/projects",
            "data-ocid": "admin_dashboard.add_project_link",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                className: "border-border/50 hover:border-primary/30 text-sm gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-3.5 h-3.5" }),
                  " Add Project"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/admin/notifications",
            "data-ocid": "admin_dashboard.send_broadcast_link",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                className: "border-border/50 hover:border-primary/30 text-sm gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-3.5 h-3.5" }),
                  " Send Broadcast"
                ]
              }
            )
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  AdminDashboardPage
};
