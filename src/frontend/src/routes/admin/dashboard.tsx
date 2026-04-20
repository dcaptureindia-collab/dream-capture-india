import type {
  CandidateProfile,
  PaymentRecord,
  ProjectRecord,
} from "@/backend.d";
import { PaymentStatus, ProjectStatus, RegistrationStatus } from "@/backend.d";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/use-backend";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Briefcase,
  CheckCircle,
  CreditCard,
  Shield,
  Users,
} from "lucide-react";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: bigint) {
  return `₹${(Number(amount) / 100).toLocaleString("en-IN")}`;
}

function regBadge(status: RegistrationStatus) {
  const map: Record<RegistrationStatus, { label: string; cls: string }> = {
    [RegistrationStatus.Pending]: {
      label: "Pending",
      cls: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
    },
    [RegistrationStatus.Approved]: {
      label: "Approved",
      cls: "bg-green-500/15 text-green-600 border-green-500/30",
    },
    [RegistrationStatus.Rejected]: {
      label: "Rejected",
      cls: "bg-destructive/15 text-destructive border-destructive/30",
    },
    [RegistrationStatus.Suspended]: {
      label: "Suspended",
      cls: "bg-muted text-muted-foreground border-border",
    },
  };
  const m = map[status] ?? map[RegistrationStatus.Pending];
  return (
    <Badge variant="outline" className={`text-xs ${m.cls}`}>
      {m.label}
    </Badge>
  );
}

function payBadge(status: PaymentStatus) {
  const map: Record<PaymentStatus, { label: string; cls: string }> = {
    [PaymentStatus.NotPaid]: {
      label: "Not Paid",
      cls: "bg-muted text-muted-foreground border-border",
    },
    [PaymentStatus.Paid]: {
      label: "Paid",
      cls: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    },
    [PaymentStatus.Verified]: {
      label: "Verified",
      cls: "bg-green-500/15 text-green-600 border-green-500/30",
    },
  };
  const m = map[status] ?? map[PaymentStatus.NotPaid];
  return (
    <Badge variant="outline" className={`text-xs ${m.cls}`}>
      {m.label}
    </Badge>
  );
}

export function AdminDashboardPage() {
  const { isAuthenticated, login, isInitializing } = useInternetIdentity();
  const { actor, isLoading: actorLoading } = useBackend();
  const navigate = useNavigate();

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery<
    CandidateProfile[]
  >({
    queryKey: ["admin", "candidates"],
    queryFn: () => actor!.listAllCandidates(),
    enabled: !!actor && !actorLoading && isAuthenticated,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<
    ProjectRecord[]
  >({
    queryKey: ["admin", "projects"],
    queryFn: () => actor!.listProjects(),
    enabled: !!actor && !actorLoading && isAuthenticated,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<
    PaymentRecord[]
  >({
    queryKey: ["admin", "payments"],
    queryFn: () => actor!.listPayments(),
    enabled: !!actor && !actorLoading && isAuthenticated,
  });

  if (isInitializing) {
    return (
      <AdminLayout>
        <div
          className="flex items-center justify-center h-64"
          data-ocid="admin_dashboard.loading_state"
        >
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div
          className="flex flex-col items-center justify-center h-64 gap-4 text-center"
          data-ocid="admin_dashboard.auth_required"
        >
          <Shield className="w-10 h-10 text-primary/40" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Admin Login Required
          </h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            Admin panel access karne ke liye login karein.
          </p>
          <Button
            type="button"
            onClick={login}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="admin_dashboard.login_button"
          >
            Login with Internet Identity
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const totalApplicants = candidates.length;
  const paymentVerified = candidates.filter(
    (c) => c.paymentStatus === PaymentStatus.Verified,
  ).length;
  const pendingApprovals = candidates.filter(
    (c) => c.registrationStatus === RegistrationStatus.Pending,
  ).length;
  const activeProjects = projects.filter(
    (p) => p.status === ProjectStatus.Active,
  ).length;

  const recentCandidates = [...candidates]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  const STATS = [
    {
      label: "Total Applicants",
      value: String(totalApplicants),
      icon: Users,
      href: "/admin/candidates" as const,
      ocid: "admin_dashboard.total_applicants_card",
    },
    {
      label: "Payment Verified",
      value: String(paymentVerified),
      icon: CheckCircle,
      href: "/admin/candidates" as const,
      ocid: "admin_dashboard.payment_verified_card",
    },
    {
      label: "Pending Approvals",
      value: String(pendingApprovals),
      icon: Bell,
      href: "/admin/candidates" as const,
      ocid: "admin_dashboard.pending_approvals_card",
    },
    {
      label: "Active Projects",
      value: String(activeProjects),
      icon: Briefcase,
      href: "/admin/projects" as const,
      ocid: "admin_dashboard.active_projects_card",
    },
  ];

  const isLoading = candidatesLoading || projectsLoading || paymentsLoading;

  return (
    <AdminLayout>
      <div className="space-y-6" data-ocid="admin_dashboard.page">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Dream Capture India — Control Room
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.href}>
                <Card
                  className="bg-card border-border/50 hover:border-primary/30 transition-smooth group cursor-pointer"
                  data-ocid={stat.ocid}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {stat.label}
                        </p>
                        {isLoading ? (
                          <Skeleton className="h-8 w-12" />
                        ) : (
                          <p className="font-display text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                        )}
                      </div>
                      <div className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Applications + Payments */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Recent Applications
              </CardTitle>
              <Link to="/admin/candidates">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary hover:text-primary/80"
                  data-ocid="admin_dashboard.view_all_candidates_button"
                >
                  View All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {candidatesLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : recentCandidates.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground/60 text-sm"
                  data-ocid="admin_dashboard.candidates_empty_state"
                >
                  No candidates yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">
                          Name
                        </th>
                        <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">
                          Status
                        </th>
                        <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">
                          Payment
                        </th>
                        <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCandidates.map((c, i) => (
                        <tr
                          key={c.principalId.toString()}
                          className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                          onClick={() =>
                            navigate({
                              to: "/admin/candidates/$candidateId",
                              params: { candidateId: c.principalId.toString() },
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              navigate({
                                to: "/admin/candidates/$candidateId",
                                params: {
                                  candidateId: c.principalId.toString(),
                                },
                              });
                            }
                          }}
                          tabIndex={0}
                          data-ocid={`admin_dashboard.candidate_row.${i + 1}`}
                        >
                          <td className="px-4 py-2.5 font-medium text-foreground truncate max-w-[120px]">
                            {c.name}
                          </td>
                          <td className="px-4 py-2.5">
                            {regBadge(c.registrationStatus)}
                          </td>
                          <td className="px-4 py-2.5">
                            {payBadge(c.paymentStatus)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground text-xs">
                            {formatDate(c.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {paymentsLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : recentPayments.length === 0 ? (
                <div
                  className="text-center py-10 text-muted-foreground/60 text-sm"
                  data-ocid="admin_dashboard.payments_empty_state"
                >
                  No payments yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">
                          Payment ID
                        </th>
                        <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">
                          Amount
                        </th>
                        <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">
                          Status
                        </th>
                        <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((p, i) => (
                        <tr
                          key={p.id.toString()}
                          className="border-b border-border/30"
                          data-ocid={`admin_dashboard.payment_row.${i + 1}`}
                        >
                          <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono truncate max-w-[100px]">
                            #{p.id.toString()}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                            {formatAmount(p.amount)}
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-xs ${p.status === "Completed" ? "bg-green-500/15 text-green-600 border-green-500/30" : p.status === "Pending" ? "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}
                            >
                              {p.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-right text-muted-foreground text-xs">
                            {formatDate(p.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-base text-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link
              to="/admin/candidates"
              data-ocid="admin_dashboard.view_all_candidates_link"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary/30 text-sm gap-1.5"
              >
                <Users className="w-3.5 h-3.5" /> View All Candidates
              </Button>
            </Link>
            <Link
              to="/admin/projects"
              data-ocid="admin_dashboard.add_project_link"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary/30 text-sm gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" /> Add Project
              </Button>
            </Link>
            <Link
              to="/admin/notifications"
              data-ocid="admin_dashboard.send_broadcast_link"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary/30 text-sm gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" /> Send Broadcast
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
