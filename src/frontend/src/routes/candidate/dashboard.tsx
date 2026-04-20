import type {
  CandidateProfile,
  NotificationRecord,
  PaymentRecord,
  ProjectRecord,
} from "@/backend";
import { NotificationType, PaymentStatus, RegistrationStatus } from "@/backend";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Briefcase,
  CheckCircle2,
  Clock,
  Crown,
  Images,
  User,
  XCircle,
} from "lucide-react";

// ── Helper: format relative time ─────────────────────────────────────────────
function timeAgo(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function notificationTypeLabel(t: NotificationType): string {
  const map: Record<NotificationType, string> = {
    [NotificationType.RegistrationUpdate]: "Registration",
    [NotificationType.Reminder]: "Reminder",
    [NotificationType.Announcement]: "Announcement",
    [NotificationType.ProjectMatch]: "Project",
    [NotificationType.Offer]: "Offer",
  };
  return map[t] ?? String(t);
}

// ── Registration Status badge ─────────────────────────────────────────────────
function RegistrationBadge({ status }: { status: RegistrationStatus }) {
  const cfg = {
    [RegistrationStatus.Pending]: {
      label: "Pending",
      className: "border-yellow-500/40 text-yellow-500 bg-yellow-500/10",
      Icon: Clock,
    },
    [RegistrationStatus.Approved]: {
      label: "Approved",
      className: "border-green-500/40 text-green-500 bg-green-500/10",
      Icon: CheckCircle2,
    },
    [RegistrationStatus.Rejected]: {
      label: "Rejected",
      className: "border-destructive/40 text-destructive bg-destructive/10",
      Icon: XCircle,
    },
    [RegistrationStatus.Suspended]: {
      label: "Suspended",
      className: "border-orange-500/40 text-orange-500 bg-orange-500/10",
      Icon: AlertCircle,
    },
  };
  const c = cfg[status];
  const Icon = c.Icon;
  return (
    <Badge variant="outline" className={`text-xs ${c.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {c.label}
    </Badge>
  );
}

// ── Payment Status badge ──────────────────────────────────────────────────────
function PaymentBadge({ status }: { status: PaymentStatus }) {
  const cfg = {
    [PaymentStatus.NotPaid]: {
      label: "Not Paid",
      className: "border-destructive/40 text-destructive bg-destructive/10",
    },
    [PaymentStatus.Paid]: {
      label: "Paid",
      className: "border-yellow-500/40 text-yellow-500 bg-yellow-500/10",
    },
    [PaymentStatus.Verified]: {
      label: "Verified",
      className: "border-green-500/40 text-green-500 bg-green-500/10",
    },
  };
  const c = cfg[status];
  return (
    <Badge variant="outline" className={`text-xs ${c.className}`}>
      {c.label}
    </Badge>
  );
}

// ── Project Category label ────────────────────────────────────────────────────
function projectCategoryLabel(cat: ProjectRecord["category"]): string {
  const labels: Record<string, string> = {
    Fashion: "Fashion Shoot",
    Jewellery: "Jewellery Shoot",
    Bridal: "Bridal Shoot",
    ECommerce: "E-Commerce",
    Catalogue: "Catalogue",
    WebSeries: "Web Series",
    MusicVideo: "Music Video",
    BrandPromotion: "Brand Promotion",
    International: "International",
  };
  return labels[String(cat)] ?? String(cat);
}

// ── Skeleton loading ──────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-60 w-full" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function CandidateDashboardPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();

  const enabled = isAuthenticated && !!actor && !actorLoading;

  const { data: profile, isLoading: profileLoading } =
    useQuery<CandidateProfile | null>({
      queryKey: ["myProfile"],
      queryFn: () => actor!.getMyProfile().then((r) => r ?? null),
      enabled,
    });

  const { data: payment, isLoading: paymentLoading } =
    useQuery<PaymentRecord | null>({
      queryKey: ["myPayment"],
      queryFn: () => actor!.getMyPaymentStatus().then((r) => r ?? null),
      enabled,
    });

  const { data: notifications = [], isLoading: notifsLoading } = useQuery<
    NotificationRecord[]
  >({
    queryKey: ["myNotifications"],
    queryFn: () => actor!.getMyNotifications(),
    enabled,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<
    ProjectRecord[]
  >({
    queryKey: ["myProjects"],
    queryFn: () => actor!.getMyProjects(),
    enabled,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: bigint) => actor!.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    },
  });

  // ── Not initialised yet ────────────────────────────────────────────────
  if (isInitializing || actorLoading) {
    return (
      <CandidateLayout>
        <div
          className="flex items-center justify-center h-64"
          data-ocid="candidate_dashboard.loading_state"
        >
          <div className="text-muted-foreground animate-pulse text-sm">
            Loading...
          </div>
        </div>
      </CandidateLayout>
    );
  }

  // ── Not authenticated ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <CandidateLayout>
        <div
          className="flex flex-col items-center justify-center h-64 gap-4 text-center"
          data-ocid="candidate_dashboard.auth_required"
        >
          <Crown className="w-10 h-10 text-primary/40" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Login Required
          </h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            Please login to access your candidate dashboard.
          </p>
          <Button
            onClick={login}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="candidate_dashboard.login_button"
          >
            Login with Internet Identity
          </Button>
        </div>
      </CandidateLayout>
    );
  }

  const isDataLoading =
    profileLoading || paymentLoading || notifsLoading || projectsLoading;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <CandidateLayout>
      <div className="space-y-6" data-ocid="candidate_dashboard.page">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {profile
                ? `Welcome, ${profile.name.split(" ")[0]}`
                : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Aapka dashboard — sabkuch ek jagah
            </p>
          </div>
          {profile && <RegistrationBadge status={profile.registrationStatus} />}
        </div>

        {/* Complete Registration Banner */}
        {!profile && !isDataLoading && (
          <div
            className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/30 rounded-sm"
            data-ocid="candidate_dashboard.registration_banner"
          >
            <AlertCircle className="w-5 h-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Complete Your Registration
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Profile details fill karein taaki casting directors aapko
                shortlist kar sakein
              </p>
            </div>
            <Link
              to="/candidate/profile"
              className="shrink-0"
              data-ocid="candidate_dashboard.complete_registration_link"
            >
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                Fill Profile <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Status Cards */}
        {isDataLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            data-ocid="candidate_dashboard.status_cards"
          >
            {/* Registration Status */}
            <Card className="bg-card border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Registration Status
                  </p>
                  {profile ? (
                    <RegistrationBadge status={profile.registrationStatus} />
                  ) : (
                    <p className="text-sm font-semibold text-muted-foreground">
                      Not Registered
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card className="bg-card border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Payment Status
                  </p>
                  {profile ? (
                    <PaymentBadge status={profile.paymentStatus} />
                  ) : payment ? (
                    <Badge
                      variant="outline"
                      className="text-xs border-yellow-500/40 text-yellow-500 bg-yellow-500/10"
                    >
                      Pending
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-xs border-destructive/40 text-destructive bg-destructive/10"
                    >
                      Not Paid
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Status */}
            <Card className="bg-card border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-sm flex items-center justify-center shrink-0">
                  <Images className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    Portfolio Images
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {profile
                      ? `${profile.portfolioImages.length} Uploaded`
                      : "0 Uploaded"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Assigned Projects */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Assigned Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <DashboardSkeleton />
            ) : projects.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground/60 text-sm"
                data-ocid="candidate_dashboard.projects_empty_state"
              >
                Abhi koi project assign nahi hua. Profile complete karo aur
                approved hone ka wait karo.
              </div>
            ) : (
              <div
                className="space-y-3"
                data-ocid="candidate_dashboard.projects_list"
              >
                {projects.map((proj, idx) => (
                  <div
                    key={String(proj.id)}
                    className="flex items-center gap-3 p-3 bg-muted/20 border border-border/30 rounded-sm"
                    data-ocid={`candidate_dashboard.project.item.${idx + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {proj.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Deadline:{" "}
                        {new Date(
                          Number(proj.deadline) / 1_000_000,
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary bg-primary/5 shrink-0"
                    >
                      {projectCategoryLabel(proj.category)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Feed */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-1 bg-primary text-primary-foreground text-xs h-5 min-w-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground/60 text-sm"
                data-ocid="candidate_dashboard.notifications_empty_state"
              >
                No notifications yet. Check back after profile verification.
              </div>
            ) : (
              <div
                className="space-y-2"
                data-ocid="candidate_dashboard.notifications_list"
              >
                {notifications.map((notif, idx) => (
                  <button
                    type="button"
                    key={String(notif.id)}
                    onClick={() => {
                      if (!notif.isRead) {
                        markReadMutation.mutate(notif.id);
                      }
                    }}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-sm border transition-smooth cursor-pointer ${
                      !notif.isRead
                        ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                        : "border-border/30 bg-muted/10 hover:bg-muted/20 opacity-70"
                    }`}
                    data-ocid={`candidate_dashboard.notification.item.${idx + 1}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        !notif.isRead ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground break-words">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {notificationTypeLabel(notif.notificationType)}
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          ·
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          {timeAgo(notif.createdAt)}
                        </span>
                        {!notif.isRead && (
                          <span className="text-xs text-primary font-medium ml-auto">
                            Click to mark read
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CandidateLayout>
  );
}
