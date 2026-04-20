import { j as jsxRuntimeExports } from "./index-CebTjiTu.js";
import { C as CandidateLayout } from "./CandidateLayout-DFbBKuL5.js";
import { B as Badge } from "./badge-Bz0HIF4P.js";
import { b as useBackend, d as useQuery, C as Crown, B as Button } from "./x-CNxy1RBN.js";
import { u as useAuth, C as Card, b as CardHeader, c as CardTitle, B as Briefcase, a as CardContent } from "./card-CzpBPjzC.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import "./user-CLcws5yd.js";
const CATEGORY_LABELS = {
  Fashion: "Fashion Shoot",
  Jewellery: "Jewellery Shoot",
  Bridal: "Bridal Shoot",
  ECommerce: "E-Commerce",
  Catalogue: "Catalogue",
  WebSeries: "Web Series",
  MusicVideo: "Music Video",
  BrandPromotion: "Brand Promotion",
  International: "International Projects"
};
const STATUS_COLORS = {
  Active: "border-green-500/40 text-green-500 bg-green-500/10",
  Draft: "border-border text-muted-foreground bg-muted/30",
  Closed: "border-destructive/40 text-destructive bg-destructive/10"
};
function formatDeadline(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function CandidateProjectsPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const enabled = isAuthenticated && !!actor && !actorLoading;
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["myProjects"],
    queryFn: () => actor.getMyProjects(),
    enabled
  });
  if (isInitializing || actorLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center h-64",
        "data-ocid": "candidate_projects.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground animate-pulse text-sm", children: "Loading..." })
      }
    ) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-64 gap-4 text-center",
        "data-ocid": "candidate_projects.auth_required",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-10 h-10 text-primary/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Login Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Please login to view your assigned projects." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: login,
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              "data-ocid": "candidate_projects.login_button",
              children: "Login with Internet Identity"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "candidate_projects.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "My Projects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: "Casting projects jisme aapko assign kiya gaya hai" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-4 h-4 text-primary" }),
        "Assigned Projects",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-sm", children: [
          "(",
          projects.length,
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, i)) }) : projects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-16 flex flex-col items-center gap-3 text-muted-foreground",
          "data-ocid": "candidate_projects.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-10 h-10 text-primary/20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No projects assigned yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "Profile complete karo aur approved hone ka wait karo." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "candidate_projects.list", children: projects.map((proj, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "p-4 bg-muted/20 border border-border/30 rounded-sm hover:bg-muted/30 transition-colors",
          "data-ocid": `candidate_projects.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: proj.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: proj.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs border-primary/30 text-primary bg-primary/5",
                    children: CATEGORY_LABELS[String(proj.category)] ?? String(proj.category)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs ${STATUS_COLORS[String(proj.status)] ?? STATUS_COLORS.Draft}`,
                    children: String(proj.status)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Budget: ",
                proj.budget
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Deadline: ",
                formatDeadline(proj.deadline)
              ] })
            ] }),
            proj.requirements && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground/70 italic", children: [
              "Requirements: ",
              proj.requirements
            ] })
          ]
        },
        String(proj.id)
      )) }) })
    ] })
  ] }) });
}
export {
  CandidateProjectsPage
};
