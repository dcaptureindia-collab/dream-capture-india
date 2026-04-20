import type { ProjectInput, ProjectRecord } from "@/backend.d";
import { ProjectCategory, ProjectStatus } from "@/backend.d";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  AlertDialog,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBackend } from "@/hooks/use-backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Briefcase, Edit2, Eye, Plus, Trash2 } from "lucide-react";
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

function statusBadge(status: ProjectStatus) {
  const m = STATUS_LABELS[status] ?? STATUS_LABELS[ProjectStatus.Draft];
  return (
    <Badge variant="outline" className={`text-xs ${m.cls}`}>
      {m.label}
    </Badge>
  );
}

type FormData = {
  title: string;
  category: ProjectCategory;
  description: string;
  requirements: string;
  budget: string;
  deadline: string;
  status: ProjectStatus;
};

const DEFAULT_FORM: FormData = {
  title: "",
  category: ProjectCategory.Fashion,
  description: "",
  requirements: "",
  budget: "",
  deadline: "",
  status: ProjectStatus.Draft,
};

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AdminProjectsPage() {
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState<ProjectRecord | null>(null);
  const [deleteProject, setDeleteProject] = useState<ProjectRecord | null>(
    null,
  );
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);

  const { data: projects = [], isLoading } = useQuery<ProjectRecord[]>({
    queryKey: ["admin", "projects"],
    queryFn: () => actor!.listProjects(),
    enabled: !!actor && !actorLoading,
  });

  const addMutation = useMutation({
    mutationFn: (input: ProjectInput) => actor!.addProject(input),
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setDialogOpen(false);
      setForm(DEFAULT_FORM);
    },
    onError: () => toast.error("Failed to create project."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: bigint; input: ProjectInput }) =>
      actor!.updateProject(id, input),
    onSuccess: () => {
      toast.success("Project updated!");
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setDialogOpen(false);
      setEditProject(null);
      setForm(DEFAULT_FORM);
    },
    onError: () => toast.error("Failed to update project."),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAdd = () => {
    setEditProject(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (p: ProjectRecord) => {
    setEditProject(p);
    const deadlineMs = Number(p.deadline) / 1_000_000;
    const deadlineDate = new Date(deadlineMs).toISOString().split("T")[0];
    setForm({
      title: p.title,
      category: p.category,
      description: p.description,
      requirements: p.requirements,
      budget: p.budget,
      deadline: deadlineDate,
      status: p.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineTs =
      BigInt(new Date(form.deadline).getTime()) * BigInt(1_000_000);
    const input: ProjectInput = {
      title: form.title,
      category: form.category,
      description: form.description,
      requirements: form.requirements,
      budget: form.budget,
      deadline: deadlineTs,
      status: form.status,
    };
    if (editProject) {
      updateMutation.mutate({ id: editProject.id, input });
    } else {
      addMutation.mutate(input);
    }
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6" data-ocid="admin_projects.page">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Projects
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Create and manage casting projects
            </p>
          </div>
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            onClick={openAdd}
            data-ocid="admin_projects.add_project_button"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Project
          </Button>
        </div>

        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              All Projects
              <span className="text-muted-foreground font-normal text-sm">
                ({projects.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div
                className="text-center py-16 flex flex-col items-center gap-3 text-muted-foreground"
                data-ocid="admin_projects.empty_state"
              >
                <Briefcase className="w-10 h-10 text-primary/20" />
                <p className="text-sm font-medium">No projects created yet</p>
                <p className="text-xs text-muted-foreground/60">
                  Add a new project to start casting.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/5 mt-2"
                  onClick={openAdd}
                  data-ocid="admin_projects.empty_add_button"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                        Title
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">
                        Deadline
                      </th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">
                        Budget
                      </th>
                      <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p, i) => (
                      <tr
                        key={p.id.toString()}
                        className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                        data-ocid={`admin_projects.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground max-w-[180px] truncate">
                          {p.title}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge
                            variant="outline"
                            className="text-xs border-primary/20 text-primary bg-primary/5"
                          >
                            {CATEGORY_LABELS[p.category] ?? p.category}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{statusBadge(p.status)}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {formatDate(p.deadline)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {p.budget}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to="/admin/projects/$projectId"
                              params={{ projectId: p.id.toString() }}
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-primary"
                                aria-label="View project"
                                data-ocid={`admin_projects.view_button.${i + 1}`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              aria-label="Edit project"
                              onClick={() => openEdit(p)}
                              data-ocid={`admin_projects.edit_button.${i + 1}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-muted-foreground/40 cursor-not-allowed"
                                      aria-label="Delete project (unavailable)"
                                      disabled
                                      data-ocid={`admin_projects.delete_button.${i + 1}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="text-xs">Coming soon</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o) {
            setDialogOpen(false);
            setEditProject(null);
            setForm(DEFAULT_FORM);
          } else setDialogOpen(true);
        }}
      >
        <DialogContent
          className="bg-card border-border/50 max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin_projects.project_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editProject ? "Edit Project" : "New Project"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="proj-title">Project Title *</Label>
              <Input
                id="proj-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Luxury Jewellery Campaign 2026"
                required
                className="bg-input border-border/50"
                data-ocid="admin_projects.title_input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-category">Category *</Label>
                <select
                  id="proj-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full h-9 px-3 text-sm bg-input border border-border/50 rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  data-ocid="admin_projects.category_select"
                >
                  {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="proj-status">Status *</Label>
                <select
                  id="proj-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full h-9 px-3 text-sm bg-input border border-border/50 rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  data-ocid="admin_projects.status_select"
                >
                  <option value={ProjectStatus.Draft}>Draft</option>
                  <option value={ProjectStatus.Active}>Active</option>
                  <option value={ProjectStatus.Closed}>Closed</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-desc">Description *</Label>
              <Textarea
                id="proj-desc"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Project details..."
                rows={3}
                required
                className="bg-input border-border/50 resize-none"
                data-ocid="admin_projects.description_textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proj-req">Requirements</Label>
              <Textarea
                id="proj-req"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="Height, age, experience requirements..."
                rows={2}
                className="bg-input border-border/50 resize-none"
                data-ocid="admin_projects.requirements_textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-budget">Budget *</Label>
                <Input
                  id="proj-budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="₹50,000"
                  required
                  className="bg-input border-border/50"
                  data-ocid="admin_projects.budget_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="proj-deadline">Deadline *</Label>
                <Input
                  id="proj-deadline"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="bg-input border-border/50"
                  data-ocid="admin_projects.deadline_input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setDialogOpen(false);
                  setEditProject(null);
                  setForm(DEFAULT_FORM);
                }}
                data-ocid="admin_projects.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                data-ocid="admin_projects.submit_button"
              >
                {isSaving
                  ? "Saving..."
                  : editProject
                    ? "Update Project"
                    : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm — placeholder, backend delete not yet available */}
      <AlertDialog
        open={!!deleteProject}
        onOpenChange={(open) => !open && setDeleteProject(null)}
      >
        <AlertDialogContent
          className="bg-card border-border/50"
          data-ocid="admin_projects.delete_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-foreground">
              Delete Not Available
            </AlertDialogTitle>
            <AlertDialogDescription>
              Project deletion is coming soon. Filhaal projects ko "Closed"
              status mein set kar sakte hain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteProject(null)}
              data-ocid="admin_projects.delete_cancel_button"
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
