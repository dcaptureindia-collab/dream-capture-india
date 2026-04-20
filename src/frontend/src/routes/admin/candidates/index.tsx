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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/use-backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Eye, Search, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FilterStatus = "All" | "Pending" | "Approved" | "Rejected";

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

const FILTERS: FilterStatus[] = ["All", "Pending", "Approved", "Rejected"];

export function AdminCandidatesPage() {
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    candidate: CandidateProfile;
  } | null>(null);

  const { data: candidates = [], isLoading } = useQuery<CandidateProfile[]>({
    queryKey: ["admin", "candidates"],
    queryFn: () => actor!.listAllCandidates(),
    enabled: !!actor && !actorLoading,
  });

  const approveMutation = useMutation({
    mutationFn: (id: CandidateProfile["principalId"]) =>
      actor!.approveCandidate(id),
    onSuccess: () => {
      toast.success("Candidate approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
    onError: () => toast.error("Failed to approve candidate."),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: CandidateProfile["principalId"]) =>
      actor!.rejectCandidate(id),
    onSuccess: () => {
      toast.success("Candidate rejected.");
      queryClient.invalidateQueries({ queryKey: ["admin", "candidates"] });
    },
    onError: () => toast.error("Failed to reject candidate."),
  });

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" &&
        c.registrationStatus === RegistrationStatus.Pending) ||
      (filter === "Approved" &&
        c.registrationStatus === RegistrationStatus.Approved) ||
      (filter === "Rejected" &&
        c.registrationStatus === RegistrationStatus.Rejected);
    return matchesSearch && matchesFilter;
  });

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === "approve") {
      approveMutation.mutate(confirmAction.candidate.principalId);
    } else {
      rejectMutation.mutate(confirmAction.candidate.principalId);
    }
    setConfirmAction(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6" data-ocid="admin_candidates.page">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Candidates
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage and review all registered candidates
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9 bg-input border-border/50"
              data-ocid="admin_candidates.search_input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <Button
                key={f}
                type="button"
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "border-border/50 hover:border-primary/30"
                }
                data-ocid={`admin_candidates.filter_${f.toLowerCase()}_tab`}
              >
                {f}
                {f !== "All" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    (
                    {
                      candidates.filter(
                        (c) =>
                          c.registrationStatus ===
                          RegistrationStatus[
                            f as keyof typeof RegistrationStatus
                          ],
                      ).length
                    }
                    )
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {filter === "All" ? "All Candidates" : `${filter} Candidates`}
              <span className="text-muted-foreground font-normal text-sm">
                ({filtered.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="text-center py-16 flex flex-col items-center gap-3 text-muted-foreground"
                data-ocid="admin_candidates.empty_state"
              >
                <Users className="w-10 h-10 text-primary/20" />
                <p className="text-sm font-medium">No candidates found</p>
                <p className="text-xs text-muted-foreground/60">
                  Try adjusting your search or filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell">
                        Email
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">
                        Phone
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">
                        City
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                        Payment
                      </th>
                      <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell">
                        Portfolio
                      </th>
                      <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <tr
                        key={c.principalId.toString()}
                        className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                        data-ocid={`admin_candidates.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground truncate max-w-[120px]">
                          {c.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-[150px]">
                          {c.email}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {c.phone}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {c.city}
                        </td>
                        <td className="px-4 py-3">
                          {regBadge(c.registrationStatus)}
                        </td>
                        <td className="px-4 py-3">
                          {payBadge(c.paymentStatus)}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                          {c.portfolioImages.length}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to="/admin/candidates/$candidateId"
                              params={{ candidateId: c.principalId.toString() }}
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-primary"
                                aria-label="View candidate"
                                data-ocid={`admin_candidates.view_button.${i + 1}`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                            {c.registrationStatus ===
                              RegistrationStatus.Pending && (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-green-600 hover:bg-green-500/10"
                                  aria-label="Approve candidate"
                                  onClick={() =>
                                    setConfirmAction({
                                      type: "approve",
                                      candidate: c,
                                    })
                                  }
                                  data-ocid={`admin_candidates.approve_button.${i + 1}`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                  aria-label="Reject candidate"
                                  onClick={() =>
                                    setConfirmAction({
                                      type: "reject",
                                      candidate: c,
                                    })
                                  }
                                  data-ocid={`admin_candidates.reject_button.${i + 1}`}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
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

      {/* Confirm Dialog */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent
          className="bg-card border-border/50"
          data-ocid="admin_candidates.confirm_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-foreground">
              {confirmAction?.type === "approve"
                ? "Approve Candidate?"
                : "Reject Candidate?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "approve"
                ? `"${confirmAction?.candidate.name}" ko approve karna chahte hain?`
                : `"${confirmAction?.candidate.name}" ko reject karna chahte hain? Ye action reverse ki ja sakti hai.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_candidates.confirm_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                confirmAction?.type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-destructive hover:bg-destructive/90"
              }
              data-ocid="admin_candidates.confirm_button"
            >
              {confirmAction?.type === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
