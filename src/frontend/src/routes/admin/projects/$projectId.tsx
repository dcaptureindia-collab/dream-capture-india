import type { CandidateProfile, ProjectRecord } from "@/backend.d";
import {
  ProjectCategory,
  ProjectStatus,
  RegistrationStatus,
} from "@/backend.d";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/use-backend";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  [ProjectCategory.Fashion]: "Fashion Shoot",
  [ProjectCategory.Jewellery]: "Jewellery Shoot",
  [ProjectCategory.Bridal]: "Bridal Shoot",
  [ProjectCategory.ECommerce]: "E-Commerce",
  [ProjectCategory.Catalogue]: "Catalogue",
  [ProjectCategory.WebSeries]: "Web Series",
  [ProjectCategory.MusicVideo]: "Music Video",
  [ProjectCategory.BrandPromotion]: "Brand Promotion",
  [ProjectCategory.International]: "International Projects",
};

const STATUS_LABELS: Record<ProjectStatus, { label: string; cls: string }> = {
  [ProjectStatus.Active]: {
    label: "Active",
    cls: "bg-green-500/15 text-green-600 border-green-500/30",
  },
  [ProjectStatus.Draft]: {
    label: "Draft",
    cls: "bg-muted text-muted-foreground border-border",
  },
  [ProjectStatus.Closed]: {
    label: "Closed",
    cls: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
      <div className="w-7 h-7 bg-primary/10 rounded-sm flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function AdminProjectDetailPage() {
  const { projectId } = useParams({ strict: false }) as { projectId: string };
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    new Set(),
  );

  const projectIdBigInt = (() => {
    try {
      return BigInt(projectId);
    } catch {
      return null;
    }
  })();

  const { data: projects = [], isLoading: projectsLoading } = useQuery<
    ProjectRecord[]
  >({
    queryKey: ["admin", "projects"],
    queryFn: () => actor!.listProjects(),
    enabled: !!actor && !actorLoading,
  });

  const { data: allCandidates = [], isLoading: candidatesLoading } = useQuery<
    CandidateProfile[]
  >({
    queryKey: ["admin", "candidates"],
    queryFn: () => actor!.listAllCandidates(),
    enabled: !!actor && !actorLoading,
  });

  const project = projects.find((p) => p.id === projectIdBigInt);

  const assignMutation = useMutation({
    mutationFn: async (principals: Principal[]) => {
      for (const p of principals) {
        await actor!.assignCandidateToProject(projectIdBigInt!, p);
      }
    },
    onSuccess: () => {
      toast.success("Candidates assigned successfully!");
      setSelectedCandidates(new Set());
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
    onError: () => toast.error("Failed to assign candidates."),
  });

  const approvedCandidates = allCandidates.filter(
    (c) => c.registrationStatus === RegistrationStatus.Approved,
  );

  const assignedPrincipalSet = new Set(
    project?.assignedCandidates.map((p) => p.toString()) ?? [],
  );

  const unassignedApproved = approvedCandidates.filter(
    (c) => !assignedPrincipalSet.has(c.principalId.toString()),
  );

  const toggleCandidate = (principalStr: string) => {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(principalStr)) next.delete(principalStr);
      else next.add(principalStr);
      return next;
    });
  };

  const handleAssign = () => {
    const toAssign = allCandidates
      .filter((c) => selectedCandidates.has(c.principalId.toString()))
      .map((c) => c.principalId);
    if (toAssign.length === 0) {
      toast.warning("Please select at least one candidate.");
      return;
    }
    assignMutation.mutate(toAssign);
  };

  const isLoading = projectsLoading || candidatesLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div
          className="space-y-4 max-w-4xl"
          data-ocid="admin_project_detail.loading_state"
        >
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout>
        <div className="space-y-6 max-w-4xl">
          <Link
            to="/admin/projects"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            data-ocid="admin_project_detail.back_link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="admin_project_detail.error_state"
          >
            <Briefcase className="w-10 h-10 text-primary/20 mx-auto mb-3" />
            <p className="font-medium">Project not found</p>
            <p className="text-xs mt-1">ID: {projectId}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statusMeta =
    STATUS_LABELS[project.status] ?? STATUS_LABELS[ProjectStatus.Draft];

  return (
    <AdminLayout>
      <div
        className="space-y-6 max-w-4xl"
        data-ocid="admin_project_detail.page"
      >
        <Link
          to="/admin/projects"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          data-ocid="admin_project_detail.back_link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={`text-xs ${statusMeta.cls}`}>
                {statusMeta.label}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-primary/20 text-primary bg-primary/5"
              >
                {CATEGORY_LABELS[project.category] ?? project.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-x-8">
            <div>
              <InfoRow
                icon={FileText}
                label="Description"
                value={project.description || "—"}
              />
              <InfoRow
                icon={Tag}
                label="Requirements"
                value={project.requirements || "—"}
              />
            </div>
            <div>
              <InfoRow
                icon={DollarSign}
                label="Budget"
                value={project.budget || "—"}
              />
              <InfoRow
                icon={Calendar}
                label="Deadline"
                value={formatDate(project.deadline)}
              />
              <InfoRow
                icon={Calendar}
                label="Created"
                value={formatDate(project.createdAt)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Assigned Candidates */}
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Assigned Candidates
              <span className="text-muted-foreground font-normal text-sm">
                ({project.assignedCandidates.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.assignedCandidates.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground/60 text-sm"
                data-ocid="admin_project_detail.candidates_empty_state"
              >
                No candidates assigned to this project yet.
              </div>
            ) : (
              <div className="space-y-2">
                {project.assignedCandidates.map((principal, i) => {
                  const candidate = allCandidates.find(
                    (c) => c.principalId.toString() === principal.toString(),
                  );
                  return (
                    <div
                      key={principal.toString()}
                      className="flex items-center gap-3 p-2.5 rounded-sm bg-muted/20 border border-border/30"
                      data-ocid={`admin_project_detail.assigned_candidate.${i + 1}`}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {i + 1}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {candidate?.name ?? "Unknown Candidate"}
                        </p>
                        {candidate && (
                          <p className="text-xs text-muted-foreground">
                            {candidate.city} • {candidate.email}
                          </p>
                        )}
                      </div>
                      {candidate && (
                        <Link
                          to="/admin/candidates/$candidateId"
                          params={{ candidateId: principal.toString() }}
                          className="ml-auto"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary h-7"
                          >
                            View
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assign Candidates */}
        <Card className="bg-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              Assign Candidates
            </CardTitle>
            {selectedCandidates.size > 0 && (
              <Button
                type="button"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                onClick={handleAssign}
                disabled={assignMutation.isPending}
                data-ocid="admin_project_detail.assign_selected_button"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                {assignMutation.isPending
                  ? "Assigning..."
                  : `Assign Selected (${selectedCandidates.size})`}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {unassignedApproved.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground/60 text-sm"
                data-ocid="admin_project_detail.assign_empty_state"
              >
                {approvedCandidates.length === 0
                  ? "No approved candidates available. Approve candidates first."
                  : "All approved candidates are already assigned to this project."}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {unassignedApproved.map((c, i) => {
                  const principalStr = c.principalId.toString();
                  const isSelected = selectedCandidates.has(principalStr);
                  return (
                    <div
                      key={principalStr}
                      className={`flex items-center gap-3 p-2.5 rounded-sm border transition-colors ${
                        isSelected
                          ? "bg-primary/10 border-primary/30"
                          : "bg-muted/10 border-border/30 hover:bg-muted/20"
                      }`}
                      data-ocid={`admin_project_detail.candidate_checkbox.${i + 1}`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleCandidate(principalStr)}
                        className="border-border/50"
                        aria-label={`Select ${c.name}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.city} • {c.phone}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
