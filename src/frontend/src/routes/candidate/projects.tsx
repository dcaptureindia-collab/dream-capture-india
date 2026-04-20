import type { ProjectRecord } from "@/backend.d";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Crown } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  Fashion: "Fashion Shoot",
  Jewellery: "Jewellery Shoot",
  Bridal: "Bridal Shoot",
  ECommerce: "E-Commerce",
  Catalogue: "Catalogue",
  WebSeries: "Web Series",
  MusicVideo: "Music Video",
  BrandPromotion: "Brand Promotion",
  International: "International Projects",
};

const STATUS_COLORS: Record<string, string> = {
  Active: "border-green-500/40 text-green-500 bg-green-500/10",
  Draft: "border-border text-muted-foreground bg-muted/30",
  Closed: "border-destructive/40 text-destructive bg-destructive/10",
};

function formatDeadline(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CandidateProjectsPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();

  const enabled = isAuthenticated && !!actor && !actorLoading;

  const { data: projects = [], isLoading } = useQuery<ProjectRecord[]>({
    queryKey: ["myProjects"],
    queryFn: () => actor!.getMyProjects(),
    enabled,
  });

  if (isInitializing || actorLoading) {
    return (
      <CandidateLayout>
        <div
          className="flex items-center justify-center h-64"
          data-ocid="candidate_projects.loading_state"
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
          data-ocid="candidate_projects.auth_required"
        >
          <Crown className="w-10 h-10 text-primary/40" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Login Required
          </h2>
          <p className="text-muted-foreground text-sm">
            Please login to view your assigned projects.
          </p>
          <Button
            onClick={login}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="candidate_projects.login_button"
          >
            Login with Internet Identity
          </Button>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="space-y-6" data-ocid="candidate_projects.page">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            My Projects
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Casting projects jisme aapko assign kiya gaya hai
          </p>
        </div>

        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Assigned Projects
              <span className="text-muted-foreground font-normal text-sm">
                ({projects.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div
                className="text-center py-16 flex flex-col items-center gap-3 text-muted-foreground"
                data-ocid="candidate_projects.empty_state"
              >
                <Briefcase className="w-10 h-10 text-primary/20" />
                <p className="text-sm font-medium">No projects assigned yet</p>
                <p className="text-xs text-muted-foreground/60">
                  Profile complete karo aur approved hone ka wait karo.
                </p>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="candidate_projects.list">
                {projects.map((proj, idx) => (
                  <div
                    key={String(proj.id)}
                    className="p-4 bg-muted/20 border border-border/30 rounded-sm hover:bg-muted/30 transition-colors"
                    data-ocid={`candidate_projects.item.${idx + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {proj.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {proj.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/30 text-primary bg-primary/5"
                        >
                          {CATEGORY_LABELS[String(proj.category)] ??
                            String(proj.category)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${STATUS_COLORS[String(proj.status)] ?? STATUS_COLORS.Draft}`}
                        >
                          {String(proj.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Budget: {proj.budget}</span>
                      <span>Deadline: {formatDeadline(proj.deadline)}</span>
                    </div>
                    {proj.requirements && (
                      <p className="mt-2 text-xs text-muted-foreground/70 italic">
                        Requirements: {proj.requirements}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CandidateLayout>
  );
}
