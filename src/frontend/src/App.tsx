import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// ── Lazy loaded pages ──────────────────────────────────────────────────
const HomePage = lazy(() =>
  import("./routes/index").then((m) => ({ default: m.HomePage })),
);
const ApplyPage = lazy(() =>
  import("./routes/apply").then((m) => ({ default: m.ApplyPage })),
);
const PaymentSuccessPage = lazy(() =>
  import("./routes/payment/success").then((m) => ({
    default: m.PaymentSuccessPage,
  })),
);
const PaymentFailedPage = lazy(() =>
  import("./routes/payment/failed").then((m) => ({
    default: m.PaymentFailedPage,
  })),
);
const CandidateDashboardPage = lazy(() =>
  import("./routes/candidate/dashboard").then((m) => ({
    default: m.CandidateDashboardPage,
  })),
);
const CandidateProfilePage = lazy(() =>
  import("./routes/candidate/profile").then((m) => ({
    default: m.CandidateProfilePage,
  })),
);
const CandidatePortfolioPage = lazy(() =>
  import("./routes/candidate/portfolio").then((m) => ({
    default: m.CandidatePortfolioPage,
  })),
);
const CandidateProjectsPage = lazy(() =>
  import("./routes/candidate/projects").then((m) => ({
    default: m.CandidateProjectsPage,
  })),
);
const CandidateNotificationsPage = lazy(() =>
  import("./routes/candidate/notifications").then((m) => ({
    default: m.CandidateNotificationsPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("./routes/admin/dashboard").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const AdminCandidatesPage = lazy(() =>
  import("./routes/admin/candidates/index").then((m) => ({
    default: m.AdminCandidatesPage,
  })),
);
const AdminCandidateDetailPage = lazy(() =>
  import("./routes/admin/candidates/$candidateId").then((m) => ({
    default: m.AdminCandidateDetailPage,
  })),
);
const AdminProjectsPage = lazy(() =>
  import("./routes/admin/projects/index").then((m) => ({
    default: m.AdminProjectsPage,
  })),
);
const AdminProjectDetailPage = lazy(() =>
  import("./routes/admin/projects/$projectId").then((m) => ({
    default: m.AdminProjectDetailPage,
  })),
);
const AdminNotificationsPage = lazy(() =>
  import("./routes/admin/notifications").then((m) => ({
    default: m.AdminNotificationsPage,
  })),
);
const AdminSettingsPage = lazy(() =>
  import("./routes/admin/settings").then((m) => ({
    default: m.AdminSettingsPage,
  })),
);

// ── Loading Fallback ────────────────────────────────────────────────────
function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground animate-pulse font-display text-sm tracking-wider">
        Loading…
      </div>
    </div>
  );
}

// ── Route Tree ─────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <Toaster richColors position="top-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const applyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apply",
  component: ApplyPage,
});
const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment/success",
  component: PaymentSuccessPage,
});
const paymentFailedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment/failed",
  component: PaymentFailedPage,
});
const candidateDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidate/dashboard",
  component: CandidateDashboardPage,
});
const candidateProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidate/profile",
  component: CandidateProfilePage,
});
const candidatePortfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidate/portfolio",
  component: CandidatePortfolioPage,
});
const candidateProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidate/projects",
  component: CandidateProjectsPage,
});
const candidateNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/candidate/notifications",
  component: CandidateNotificationsPage,
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});
const adminCandidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/candidates",
  component: AdminCandidatesPage,
});
const adminCandidateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/candidates/$candidateId",
  component: AdminCandidateDetailPage,
});
const adminProjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/projects",
  component: AdminProjectsPage,
});
const adminProjectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/projects/$projectId",
  component: AdminProjectDetailPage,
});
const adminNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/notifications",
  component: AdminNotificationsPage,
});
const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: AdminSettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  applyRoute,
  paymentSuccessRoute,
  paymentFailedRoute,
  candidateDashboardRoute,
  candidateProfileRoute,
  candidatePortfolioRoute,
  candidateProjectsRoute,
  candidateNotificationsRoute,
  adminDashboardRoute,
  adminCandidatesRoute,
  adminCandidateDetailRoute,
  adminProjectsRoute,
  adminProjectDetailRoute,
  adminNotificationsRoute,
  adminSettingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
