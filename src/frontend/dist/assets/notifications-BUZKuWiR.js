import { c as useQueryClient, j as jsxRuntimeExports } from "./index-CebTjiTu.js";
import { N as NotificationType } from "./backend.d-DcSV0aLA.js";
import { C as CandidateLayout } from "./CandidateLayout-DFbBKuL5.js";
import { B as Badge } from "./badge-Bz0HIF4P.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, C as Crown, B as Button } from "./x-CNxy1RBN.js";
import { u as useAuth, C as Card, b as CardHeader, c as CardTitle, d as Bell, a as CardContent } from "./card-CzpBPjzC.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import "./user-CLcws5yd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode);
const TYPE_LABELS = {
  [NotificationType.RegistrationUpdate]: "Registration",
  [NotificationType.Reminder]: "Reminder",
  [NotificationType.Announcement]: "Announcement",
  [NotificationType.ProjectMatch]: "Project",
  [NotificationType.Offer]: "Offer"
};
const TYPE_COLORS = {
  [NotificationType.RegistrationUpdate]: "border-primary/30 text-primary bg-primary/5",
  [NotificationType.Reminder]: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
  [NotificationType.Announcement]: "border-blue-500/30 text-blue-400 bg-blue-500/5",
  [NotificationType.ProjectMatch]: "border-green-500/30 text-green-500 bg-green-500/5",
  [NotificationType.Offer]: "border-purple-500/30 text-purple-400 bg-purple-500/5"
};
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
function CandidateNotificationsPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const enabled = isAuthenticated && !!actor && !actorLoading;
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["myNotifications"],
    queryFn: () => actor.getMyNotifications(),
    enabled
  });
  const markReadMutation = useMutation({
    mutationFn: (id) => actor.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    }
  });
  const markAllRead = () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      markReadMutation.mutate(n.id);
    }
  };
  if (isInitializing || actorLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center h-64",
        "data-ocid": "candidate_notifications.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground animate-pulse text-sm", children: "Loading..." })
      }
    ) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-64 gap-4 text-center",
        "data-ocid": "candidate_notifications.auth_required",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-10 h-10 text-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Login Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Please login to view your notifications." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: login,
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              "data-ocid": "candidate_notifications.login_button",
              children: "Login with Internet Identity"
            }
          )
        ]
      }
    ) });
  }
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "candidate_notifications.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Apke saare updates aur announcements" })
      ] }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "border-primary/30 text-primary hover:bg-primary/5",
          onClick: markAllRead,
          disabled: markReadMutation.isPending,
          "data-ocid": "candidate_notifications.mark_all_read_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5 mr-1.5" }),
            "Mark All Read (",
            unreadCount,
            ")"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-primary" }),
        "All Notifications",
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "ml-1 bg-primary text-primary-foreground text-xs h-5 min-w-5 px-1.5", children: [
          unreadCount,
          " new"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, i)) }) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-16 flex flex-col items-center gap-3 text-muted-foreground",
          "data-ocid": "candidate_notifications.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-10 h-10 text-primary/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No notifications yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "Profile verify hone ke baad updates milenge." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-2",
          "data-ocid": "candidate_notifications.list",
          children: notifications.map((notif, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                if (!notif.isRead) markReadMutation.mutate(notif.id);
              },
              className: `w-full text-left flex items-start gap-3 p-4 rounded-sm border transition-smooth ${!notif.isRead ? "border-primary/40 bg-primary/5 hover:bg-primary/10" : "border-border/30 bg-muted/10 hover:bg-muted/20 opacity-70"}`,
              "data-ocid": `candidate_notifications.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-2 h-2 rounded-full mt-2 shrink-0 ${!notif.isRead ? "bg-primary" : "bg-muted-foreground/30"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground break-words leading-relaxed", children: notif.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-xs ${TYPE_COLORS[notif.notificationType] ?? ""}`,
                        children: TYPE_LABELS[notif.notificationType] ?? String(notif.notificationType)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: timeAgo(notif.createdAt) }),
                    !notif.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium ml-auto", children: "Tap to mark read" })
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
  CandidateNotificationsPage
};
