import type { CandidateProfile } from "@/backend.d";
import { PaymentStatus, RegistrationStatus } from "@/backend.d";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/use-backend";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Image,
  Mail,
  MapPin,
  Phone,
  Ruler,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
    <Badge variant="outline" className={`${m.cls}`}>
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
      label: "Verified ✓",
      cls: "bg-green-500/15 text-green-600 border-green-500/30",
    },
  };
  const m = map[status] ?? map[PaymentStatus.NotPaid];
  return (
    <Badge variant="outline" className={`${m.cls}`}>
      {m.label}
    </Badge>
  );
}

function DetailRow({
  label,
  value,
}: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground sm:w-36 shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export function AdminCandidateDetailPage() {
  const { candidateId } = useParams({ strict: false }) as {
    candidateId: string;
  };
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);

  const principalObj = (() => {
    try {
      return Principal.fromText(candidateId);
    } catch {
      return null;
    }
  })();

  const { data: candidate, isLoading } = useQuery<CandidateProfile | null>({
    queryKey: ["admin", "candidate", candidateId],
    queryFn: () => actor!.getCandidateDetail(principalObj!),
    enabled: !!actor && !actorLoading && !!principalObj,
  });

  const approveMutation = useMutation({
    mutationFn: () => actor!.approveCandidate(principalObj!),
    onSuccess: () => {
      toast.success("Candidate approved!");
      queryClient.invalidateQueries({
        queryKey: ["admin", "candidate", candidateId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
    onError: () => toast.error("Failed to approve candidate."),
  });

  const rejectMutation = useMutation({
    mutationFn: () => actor!.rejectCandidate(principalObj!),
    onSuccess: () => {
      toast.success("Candidate rejected.");
      queryClient.invalidateQueries({
        queryKey: ["admin", "candidate", candidateId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
    onError: () => toast.error("Failed to reject candidate."),
  });

  const handleConfirm = () => {
    if (confirmAction === "approve") approveMutation.mutate();
    else if (confirmAction === "reject") rejectMutation.mutate();
    setConfirmAction(null);
  };

  return (
    <AdminLayout>
      <div
        className="space-y-6 max-w-4xl"
        data-ocid="admin_candidate_detail.page"
      >
        <Link
          to="/admin/candidates"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          data-ocid="admin_candidate_detail.back_link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>

        {isLoading ? (
          <div
            data-ocid="admin_candidate_detail.loading_state"
            className="space-y-4"
          >
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : !candidate ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="admin_candidate_detail.error_state"
          >
            <User className="w-10 h-10 text-primary/20 mx-auto mb-3" />
            <p className="font-medium">Candidate not found</p>
            <p className="text-xs mt-1">ID: {candidateId}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {candidate.name}
                </h1>
                <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                  {candidateId}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {regBadge(candidate.registrationStatus)}
                  {payBadge(candidate.paymentStatus)}
                </div>
              </div>
              {candidate.registrationStatus === RegistrationStatus.Pending && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => setConfirmAction("reject")}
                    data-ocid="admin_candidate_detail.reject_button"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    onClick={() => setConfirmAction("approve")}
                    data-ocid="admin_candidate_detail.approve_button"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Approve
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-x-8">
                <div>
                  <DetailRow label="Full Name" value={candidate.name} />
                  <DetailRow
                    label="Email"
                    value={
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {candidate.email}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Phone"
                    value={
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        {candidate.phone}
                      </span>
                    }
                  />
                  <DetailRow
                    label="City"
                    value={
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {candidate.city}
                      </span>
                    }
                  />
                </div>
                <div>
                  <DetailRow label="Age" value={`${candidate.age} years`} />
                  <DetailRow
                    label="Height"
                    value={
                      <span className="flex items-center gap-1.5">
                        <Ruler className="w-3 h-3 text-muted-foreground" />
                        {candidate.height}
                      </span>
                    }
                  />
                  <DetailRow
                    label="Measurements"
                    value={candidate.measurements || "—"}
                  />
                  <DetailRow
                    label="Registered"
                    value={
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {formatDate(candidate.createdAt)}
                      </span>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Payment Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {payBadge(candidate.paymentStatus)}
                  <p className="text-sm text-muted-foreground">
                    {candidate.paymentStatus === PaymentStatus.Verified
                      ? "Payment verified. Candidate is eligible for projects."
                      : candidate.paymentStatus === PaymentStatus.Paid
                        ? "Payment received, awaiting verification."
                        : "Onboarding fee not paid yet."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  Portfolio Images
                  <span className="text-muted-foreground font-normal text-sm">
                    ({candidate.portfolioImages.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.portfolioImages.length === 0 ? (
                  <div
                    className="text-center py-10 text-muted-foreground/60 flex flex-col items-center gap-2"
                    data-ocid="admin_candidate_detail.portfolio_empty_state"
                  >
                    <Image className="w-8 h-8 text-primary/20" />
                    <p className="text-sm">No portfolio images uploaded yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {candidate.portfolioImages.map((img, i) => (
                      <div
                        key={img.getDirectURL()}
                        className="aspect-[3/4] rounded-sm overflow-hidden bg-muted border border-border/30"
                        data-ocid={`admin_candidate_detail.portfolio_image.${i + 1}`}
                      >
                        <img
                          src={img.getDirectURL()}
                          alt={`Portfolio ${i + 1} - ${candidate.name}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Confirm Dialog */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent
          className="bg-card border-border/50"
          data-ocid="admin_candidate_detail.confirm_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-foreground">
              {confirmAction === "approve"
                ? "Approve Candidate?"
                : "Reject Candidate?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "approve"
                ? "Is candidate ko approve karein? Unhe projects assign kiye ja sakte hain."
                : "Is candidate ko reject karein? Ye decision baad mein change ki ja sakti hai."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_candidate_detail.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                confirmAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-destructive hover:bg-destructive/90"
              }
              data-ocid="admin_candidate_detail.confirm_button"
            >
              {confirmAction === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
