import { c as useQueryClient, j as jsxRuntimeExports, L as Link } from "./index-CebTjiTu.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, C as Crown, B as Button, R as RegistrationStatus, P as PaymentStatus, N as NotificationType } from "./x-CNxy1RBN.js";
import { C as CandidateLayout, I as Images } from "./CandidateLayout-DFbBKuL5.js";
import { B as Badge } from "./badge-Bz0HIF4P.js";
import { u as useAuth, C as Card, a as CardContent, b as CardHeader, c as CardTitle, B as Briefcase, d as Bell } from "./card-CzpBPjzC.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import { A as ArrowRight } from "./arrow-right-DcR4w7M6.js";
import { U as User } from "./user-CLcws5yd.js";
import { C as CircleCheck } from "./circle-check-CcVaUi-L.js";
import { C as CircleX } from "./circle-x-BGq9IcKP.js";
import { C as Clock } from "./clock-DH-P6xGA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
function timeAgo(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function notificationTypeLabel(t) {
  const map = {
    [NotificationType.RegistrationUpdate]: "Registration",
    [NotificationType.Reminder]: "Reminder",
    [NotificationType.Announcement]: "Announcement",
    [NotificationType.ProjectMatch]: "Project",
    [NotificationType.Offer]: "Offer"
  };
  return map[t] ?? String(t);
}
function RegistrationBadge({ status }) {
  const cfg = {
    [RegistrationStatus.Pending]: {
      label: "Pending",
      className: "border-yellow-500/40 text-yellow-500 bg-yellow-500/10",
      Icon: Clock
    },
    [RegistrationStatus.Approved]: {
      label: "Approved",
      className: "border-green-500/40 text-green-500 bg-green-500/10",
      Icon: CircleCheck
    },
    [RegistrationStatus.Rejected]: {
      label: "Rejected",
      className: "border-destructive/40 text-destructive bg-destructive/10",
      Icon: CircleX
    },
    [RegistrationStatus.Suspended]: {
      label: "Suspended",
      className: "border-orange-500/40 text-orange-500 bg-orange-500/10",
      Icon: CircleAlert
    }
  };
  const c = cfg[status];
  const Icon = c.Icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: `text-xs ${c.className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3 h-3 mr-1" }),
    c.label
  ] });
}
function PaymentBadge({ status }) {
  const cfg = {
    [PaymentStatus.NotPaid]: {
      label: "Not Paid",
      className: "border-destructive/40 text-destructive bg-destructive/10"
    },
    [PaymentStatus.Paid]: {
      label: "Paid",
      className: "border-yellow-500/40 text-yellow-500 bg-yellow-500/10"
    },
    [PaymentStatus.Verified]: {
      label: "Verified",
      className: "border-green-500/40 text-green-500 bg-green-500/10"
    }
  };
  const c = cfg[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-xs ${c.className}`, children: c.label });
}
function projectCategoryLabel(cat) {
  const labels = {
    Fashion: "Fashion Shoot",
    Jewellery: "Jewellery Shoot",
    Bridal: "Bridal Shoot",
    ECommerce: "E-Commerce",
    Catalogue: "Catalogue",
    WebSeries: "Web Series",
    MusicVideo: "Music Video",
    BrandPromotion: "Brand Promotion",
    International: "International"
  };
  return labels[String(cat)] ?? String(cat);
}
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-60 w-full" })
  ] });
}
function CandidateDashboardPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const enabled = isAuthenticated && !!actor && !actorLoading;
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => actor.getMyProfile().then((r) => r ?? null),
    enabled
  });
  const { data: payment, isLoading: paymentLoading } = useQuery({
    queryKey: ["myPayment"],
    queryFn: () => actor.getMyPaymentStatus().then((r) => r ?? null),
    enabled
  });
  const { data: notifications = [], isLoading: notifsLoading } = useQuery({
    queryKey: ["myNotifications"],
    queryFn: () => actor.getMyNotifications(),
    enabled
  });
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["myProjects"],
    queryFn: () => actor.getMyProjects(),
    enabled
  });
  const markReadMutation = useMutation({
    mutationFn: (id) => actor.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    }
  });
  if (isInitializing || actorLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center h-64",
        "data-ocid": "candidate_dashboard.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground animate-pulse text-sm", children: "Loading..." })
      }
    ) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-64 gap-4 text-center",
        "data-ocid": "candidate_dashboard.auth_required",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-10 h-10 text-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Login Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm text-sm", children: "Please login to access your candidate dashboard." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: login,
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              "data-ocid": "candidate_dashboard.login_button",
              children: "Login with Internet Identity"
            }
          )
        ]
      }
    ) });
  }
  const isDataLoading = profileLoading || paymentLoading || notifsLoading || projectsLoading;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "candidate_dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: profile ? `Welcome, ${profile.name.split(" ")[0]}` : "Welcome Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Aapka dashboard — sabkuch ek jagah" })
      ] }),
      profile && /* @__PURE__ */ jsxRuntimeExports.jsx(RegistrationBadge, { status: profile.registrationStatus })
    ] }),
    !profile && !isDataLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-4 p-4 bg-primary/10 border border-primary/30 rounded-sm",
        "data-ocid": "candidate_dashboard.registration_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Complete Your Registration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Profile details fill karein taaki casting directors aapko shortlist kar sakein" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/candidate/profile",
              className: "shrink-0",
              "data-ocid": "candidate_dashboard.complete_registration_link",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 font-medium",
                  children: [
                    "Fill Profile ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5 ml-1.5" })
                  ]
                }
              )
            }
          )
        ]
      }
    ),
    isDataLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
        "data-ocid": "candidate_dashboard.status_cards",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Registration Status" }),
              profile ? /* @__PURE__ */ jsxRuntimeExports.jsx(RegistrationBadge, { status: profile.registrationStatus }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: "Not Registered" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Payment Status" }),
              profile ? /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentBadge, { status: profile.paymentStatus }) : payment ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs border-yellow-500/40 text-yellow-500 bg-yellow-500/10",
                  children: "Pending"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs border-destructive/40 text-destructive bg-destructive/10",
                  children: "Not Paid"
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Images, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Portfolio Images" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: profile ? `${profile.portfolioImages.length} Uploaded` : "0 Uploaded" })
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-4 h-4 text-primary" }),
        "Assigned Projects"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: projectsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSkeleton, {}) : projects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-8 text-muted-foreground/60 text-sm",
          "data-ocid": "candidate_dashboard.projects_empty_state",
          children: "Abhi koi project assign nahi hua. Profile complete karo aur approved hone ka wait karo."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-3",
          "data-ocid": "candidate_dashboard.projects_list",
          children: projects.map((proj, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 p-3 bg-muted/20 border border-border/30 rounded-sm",
              "data-ocid": `candidate_dashboard.project.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: proj.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "Deadline:",
                    " ",
                    new Date(
                      Number(proj.deadline) / 1e6
                    ).toLocaleDateString("en-IN")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs border-primary/30 text-primary bg-primary/5 shrink-0",
                    children: projectCategoryLabel(proj.category)
                  }
                )
              ]
            },
            String(proj.id)
          ))
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-primary" }),
        "Notifications",
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 bg-primary text-primary-foreground text-xs h-5 min-w-5 px-1.5", children: unreadCount })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: notifsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }, i)) }) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-8 text-muted-foreground/60 text-sm",
          "data-ocid": "candidate_dashboard.notifications_empty_state",
          children: "No notifications yet. Check back after profile verification."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-2",
          "data-ocid": "candidate_dashboard.notifications_list",
          children: notifications.map((notif, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                if (!notif.isRead) {
                  markReadMutation.mutate(notif.id);
                }
              },
              className: `w-full text-left flex items-start gap-3 p-3 rounded-sm border transition-smooth cursor-pointer ${!notif.isRead ? "border-primary/40 bg-primary/5 hover:bg-primary/10" : "border-border/30 bg-muted/10 hover:bg-muted/20 opacity-70"}`,
              "data-ocid": `candidate_dashboard.notification.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.isRead ? "bg-primary" : "bg-muted-foreground/30"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground break-words", children: notif.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: notificationTypeLabel(notif.notificationType) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "·" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: timeAgo(notif.createdAt) }),
                    !notif.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium ml-auto", children: "Click to mark read" })
                  ] })
                ] })
              ]
            },
            String(notif.id)
          ))
        }
      ) })
    ] })
  ] }) });
}
export {
  CandidateDashboardPage
};
