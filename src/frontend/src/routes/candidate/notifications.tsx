import type { NotificationRecord } from "@/backend.d";
import { NotificationType } from "@/backend.d";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Crown } from "lucide-react";

const TYPE_LABELS: Record<NotificationType, string> = {
  [NotificationType.RegistrationUpdate]: "Registration",
  [NotificationType.Reminder]: "Reminder",
  [NotificationType.Announcement]: "Announcement",
  [NotificationType.ProjectMatch]: "Project",
  [NotificationType.Offer]: "Offer",
};

const TYPE_COLORS: Record<NotificationType, string> = {
  [NotificationType.RegistrationUpdate]:
    "border-primary/30 text-primary bg-primary/5",
  [NotificationType.Reminder]:
    "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
  [NotificationType.Announcement]:
    "border-blue-500/30 text-blue-400 bg-blue-500/5",
  [NotificationType.ProjectMatch]:
    "border-green-500/30 text-green-500 bg-green-500/5",
  [NotificationType.Offer]:
    "border-purple-500/30 text-purple-400 bg-purple-500/5",
};

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

export function CandidateNotificationsPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();

  const enabled = isAuthenticated && !!actor && !actorLoading;

  const { data: notifications = [], isLoading } = useQuery<
    NotificationRecord[]
  >({
    queryKey: ["myNotifications"],
    queryFn: () => actor!.getMyNotifications(),
    enabled,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: bigint) => actor!.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNotifications"] });
    },
  });

  const markAllRead = () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      markReadMutation.mutate(n.id);
    }
  };

  if (isInitializing || actorLoading) {
    return (
      <CandidateLayout>
        <div
          className="flex items-center justify-center h-64"
          data-ocid="candidate_notifications.loading_state"
        >
          <div className="text-muted-foreground animate-pulse text-sm">
            Loading...
          </div>
        </div>
      </CandidateLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <CandidateLayout>
        <div
          className="flex flex-col items-center justify-center h-64 gap-4 text-center"
          data-ocid="candidate_notifications.auth_required"
        >
          <Crown className="w-10 h-10 text-primary/40" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Login Required
          </h2>
          <p className="text-muted-foreground text-sm">
            Please login to view your notifications.
          </p>
          <Button
            onClick={login}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="candidate_notifications.login_button"
          >
            Login with Internet Identity
          </Button>
        </div>
      </CandidateLayout>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <CandidateLayout>
      <div className="space-y-6" data-ocid="candidate_notifications.page">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Apke saare updates aur announcements
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/5"
              onClick={markAllRead}
              disabled={markReadMutation.isPending}
              data-ocid="candidate_notifications.mark_all_read_button"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>

        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              All Notifications
              {unreadCount > 0 && (
                <Badge className="ml-1 bg-primary text-primary-foreground text-xs h-5 min-w-5 px-1.5">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div
                className="text-center py-16 flex flex-col items-center gap-3 text-muted-foreground"
                data-ocid="candidate_notifications.empty_state"
              >
                <Bell className="w-10 h-10 text-primary/20" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-muted-foreground/60">
                  Profile verify hone ke baad updates milenge.
                </p>
              </div>
            ) : (
              <div
                className="space-y-2"
                data-ocid="candidate_notifications.list"
              >
                {notifications.map((notif, idx) => (
                  <button
                    type="button"
                    key={String(notif.id)}
                    onClick={() => {
                      if (!notif.isRead) markReadMutation.mutate(notif.id);
                    }}
                    className={`w-full text-left flex items-start gap-3 p-4 rounded-sm border transition-smooth ${
                      !notif.isRead
                        ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                        : "border-border/30 bg-muted/10 hover:bg-muted/20 opacity-70"
                    }`}
                    data-ocid={`candidate_notifications.item.${idx + 1}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        !notif.isRead ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground break-words leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs ${TYPE_COLORS[notif.notificationType] ?? ""}`}
                        >
                          {TYPE_LABELS[notif.notificationType] ??
                            String(notif.notificationType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground/60">
                          {timeAgo(notif.createdAt)}
                        </span>
                        {!notif.isRead && (
                          <span className="text-xs text-primary font-medium ml-auto">
                            Tap to mark read
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
