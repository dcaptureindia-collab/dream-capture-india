import type { CandidateProfile } from "@/backend.d";
import { NotificationType, RegistrationStatus } from "@/backend.d";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/use-backend";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, MessageCircle, Send, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NOTIFICATION_TYPES = [
  { value: NotificationType.Announcement, label: "Announcement" },
  { value: NotificationType.RegistrationUpdate, label: "Registration Update" },
  { value: NotificationType.ProjectMatch, label: "Project Match" },
  { value: NotificationType.Offer, label: "Offer" },
  { value: NotificationType.Reminder, label: "Reminder" },
];

type RecipientMode = "all" | "approved" | "specific";

export function AdminNotificationsPage() {
  const { actor, isLoading: actorLoading } = useBackend();
  const [message, setMessage] = useState("");
  const [notifType, setNotifType] = useState<NotificationType>(
    NotificationType.Announcement,
  );
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("all");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [selectedRecipient, setSelectedRecipient] =
    useState<CandidateProfile | null>(null);

  const { data: candidates = [], isLoading: candidatesLoading } = useQuery<
    CandidateProfile[]
  >({
    queryKey: ["admin", "candidates"],
    queryFn: () => actor!.listAllCandidates(),
    enabled: !!actor && !actorLoading,
  });

  const broadcastMutation = useMutation({
    mutationFn: async ({
      recipients,
      msg,
      type,
    }: { recipients: Principal[]; msg: string; type: NotificationType }) => {
      await actor!.broadcastNotification(recipients, msg, type);
    },
    onSuccess: () => {
      toast.success("Notification sent successfully!");
      setMessage("");
    },
    onError: () => toast.error("Failed to send notification."),
  });

  const singleMutation = useMutation({
    mutationFn: async ({
      recipient,
      msg,
      type,
    }: { recipient: Principal; msg: string; type: NotificationType }) => {
      await actor!.sendNotification(recipient, msg, type);
    },
    onSuccess: () => {
      toast.success("Notification sent!");
      setMessage("");
      setSelectedRecipient(null);
      setCandidateSearch("");
    },
    onError: () => toast.error("Failed to send notification."),
  });

  const approvedCandidates = candidates.filter(
    (c) => c.registrationStatus === RegistrationStatus.Approved,
  );

  const filteredSearch =
    candidateSearch.trim().length > 0
      ? candidates.filter(
          (c) =>
            c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
            c.email.toLowerCase().includes(candidateSearch.toLowerCase()),
        )
      : [];

  const getRecipientCount = () => {
    if (recipientMode === "all") return candidates.length;
    if (recipientMode === "approved") return approvedCandidates.length;
    return selectedRecipient ? 1 : 0;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.warning("Message cannot be empty.");
      return;
    }
    if (recipientMode === "specific") {
      if (!selectedRecipient) {
        toast.warning("Please select a recipient.");
        return;
      }
      singleMutation.mutate({
        recipient: selectedRecipient.principalId,
        msg: message,
        type: notifType,
      });
    } else {
      const recipients =
        recipientMode === "all"
          ? candidates.map((c) => c.principalId)
          : approvedCandidates.map((c) => c.principalId);
      broadcastMutation.mutate({ recipients, msg: message, type: notifType });
    }
  };

  const isSending = broadcastMutation.isPending || singleMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl" data-ocid="admin_notifications.page">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Send notifications to candidates
          </p>
        </div>

        {/* Send Notification Form */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Send className="w-4 h-4 text-primary" />
              Send Notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-5">
              {/* Recipient Mode */}
              <div className="space-y-2">
                <Label>Recipients</Label>
                <div className="flex flex-wrap gap-2">
                  {(["all", "approved", "specific"] as RecipientMode[]).map(
                    (mode) => (
                      <Button
                        key={mode}
                        type="button"
                        variant={recipientMode === mode ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setRecipientMode(mode);
                          setSelectedRecipient(null);
                          setCandidateSearch("");
                        }}
                        className={
                          recipientMode === mode
                            ? "bg-primary text-primary-foreground"
                            : "border-border/50 hover:border-primary/30"
                        }
                        data-ocid={`admin_notifications.recipient_${mode}_toggle`}
                      >
                        {mode === "all"
                          ? "All Candidates"
                          : mode === "approved"
                            ? "All Approved"
                            : "Specific Candidate"}
                      </Button>
                    ),
                  )}
                </div>
                {recipientMode !== "specific" && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {candidatesLoading
                      ? "Loading..."
                      : `${getRecipientCount()} recipient${getRecipientCount() !== 1 ? "s" : ""}`}
                  </p>
                )}
              </div>

              {/* Specific Candidate Search */}
              {recipientMode === "specific" && (
                <div className="space-y-2">
                  <Label htmlFor="candidate-search">Search Candidate</Label>
                  <div className="relative">
                    <Input
                      id="candidate-search"
                      value={
                        selectedRecipient
                          ? selectedRecipient.name
                          : candidateSearch
                      }
                      onChange={(e) => {
                        setCandidateSearch(e.target.value);
                        setSelectedRecipient(null);
                      }}
                      placeholder="Search by name or email..."
                      className="bg-input border-border/50"
                      data-ocid="admin_notifications.candidate_search_input"
                    />
                    {filteredSearch.length > 0 && !selectedRecipient && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-sm shadow-luxury overflow-hidden max-h-40 overflow-y-auto">
                        {filteredSearch.slice(0, 6).map((c) => (
                          <button
                            key={c.principalId.toString()}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
                            onClick={() => {
                              setSelectedRecipient(c);
                              setCandidateSearch("");
                            }}
                            data-ocid="admin_notifications.candidate_option"
                          >
                            <span className="font-medium text-foreground">
                              {c.name}
                            </span>
                            <span className="text-muted-foreground ml-2 text-xs">
                              {c.email}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedRecipient && (
                    <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-sm">
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/30 text-primary bg-primary/10"
                      >
                        {selectedRecipient.name}
                      </Badge>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground ml-auto"
                        onClick={() => setSelectedRecipient(null)}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Notification Type */}
              <div className="space-y-1.5">
                <Label htmlFor="notif-type">Notification Type</Label>
                <select
                  id="notif-type"
                  value={notifType}
                  onChange={(e) =>
                    setNotifType(e.target.value as NotificationType)
                  }
                  className="w-full h-9 px-3 text-sm bg-input border border-border/50 rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  data-ocid="admin_notifications.type_select"
                >
                  {NOTIFICATION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="notif-message">Message *</Label>
                <Textarea
                  id="notif-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Aapke liye ek important message hai..."
                  rows={4}
                  required
                  className="bg-input border-border/50 resize-none"
                  data-ocid="admin_notifications.message_textarea"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {message.length} characters
                </p>
              </div>

              {/* Message Preview */}
              {message.trim() && (
                <div className="p-3 bg-muted/30 border border-border/30 rounded-sm space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <MessageCircle className="w-3 h-3" /> Preview
                  </p>
                  <p className="text-sm text-foreground">{message}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary bg-primary/5"
                    >
                      {
                        NOTIFICATION_TYPES.find((t) => t.value === notifType)
                          ?.label
                      }
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      → {getRecipientCount()} recipient
                      {getRecipientCount() !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  isSending || !message.trim() || getRecipientCount() === 0
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                data-ocid="admin_notifications.send_button"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending
                  ? "Sending..."
                  : `Send to ${getRecipientCount()} Recipient${getRecipientCount() !== 1 ? "s" : ""}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-card border-border/50 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Notification Tips
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>
                    Broadcast notifications are sent to all selected recipients
                    at once.
                  </li>
                  <li>
                    Use "Project Match" type when notifying about new casting
                    opportunities.
                  </li>
                  <li>
                    Candidates can view all notifications in their dashboard.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
