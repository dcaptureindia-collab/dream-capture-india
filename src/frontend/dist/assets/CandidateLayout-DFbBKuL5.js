import { r as reactExports, d as useRouterState, j as jsxRuntimeExports, L as Link } from "./index-CebTjiTu.js";
import { B as Badge } from "./badge-Bz0HIF4P.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, C as Crown, B as Button, X, M as Menu } from "./x-CNxy1RBN.js";
import { u as useAuth, L as LayoutDashboard, B as Briefcase, d as Bell, e as LogOut } from "./card-CzpBPjzC.js";
import { U as User } from "./user-CLcws5yd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6", key: "pblm9e" }],
  ["path", { d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18", key: "nf6bnh" }],
  ["circle", { cx: "12", cy: "8", r: "2", key: "1822b1" }],
  ["rect", { width: "16", height: "16", x: "6", y: "2", rx: "2", key: "12espp" }]
];
const Images = createLucideIcon("images", __iconNode);
const NAV_ITEMS = [
  { label: "Dashboard", href: "/candidate/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/candidate/profile", icon: User },
  { label: "Portfolio", href: "/candidate/portfolio", icon: Images },
  { label: "Projects", href: "/candidate/projects", icon: Briefcase },
  { label: "Notifications", href: "/candidate/notifications", icon: Bell }
];
function CandidateLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const { logout, principal, isAuthenticated } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: notifications = [] } = useQuery({
    queryKey: ["myNotifications"],
    queryFn: () => actor.getMyNotifications(),
    enabled: isAuthenticated && !!actor && !actorLoading
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : ""
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background text-foreground", children: [
    sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden",
        onClick: () => setSidebarOpen(false),
        onKeyDown: () => setSidebarOpen(false),
        role: "button",
        tabIndex: 0,
        "aria-label": "Close sidebar"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: `fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-semibold text-primary tracking-wide", children: "Dream Capture" })
            ] }),
            principal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "mt-2 text-xs text-muted-foreground truncate",
                title: principal,
                children: [
                  principal.slice(0, 20),
                  "..."
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-4 space-y-1 overflow-y-auto", children: NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: item.href,
                className: `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-smooth ${isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`,
                "data-ocid": `candidate_sidebar.${item.label.toLowerCase()}_link`,
                onClick: () => setSidebarOpen(false),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
                  item.label === "Notifications" && unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto bg-primary text-primary-foreground text-xs h-5 min-w-5 flex items-center justify-center", children: unreadCount })
                ]
              },
              item.href
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
              onClick: logout,
              "data-ocid": "candidate_sidebar.logout_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
                "Sign Out"
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 bg-primary w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between lg:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-semibold text-primary", children: "Dream Capture" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => setSidebarOpen(!sidebarOpen),
            "aria-label": "Toggle sidebar",
            children: sidebarOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto bg-background p-6", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-muted/20 border-t border-border/30 px-6 py-3 text-xs text-muted-foreground text-center", children: [
        "© ",
        currentYear,
        ". Built with love using",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-primary transition-colors",
            children: "caffeine.ai"
          }
        )
      ] })
    ] })
  ] });
}
export {
  CandidateLayout as C,
  Images as I
};
