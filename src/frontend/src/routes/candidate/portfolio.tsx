import type { CandidateProfile } from "@/backend";
import { ExternalBlob } from "@/backend";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGES = 10;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface LocalImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
}

// ── Existing image card ───────────────────────────────────────────────────────
function ExistingImageCard({
  blob,
  index,
}: {
  blob: ExternalBlob;
  index: number;
}) {
  return (
    <div
      className="relative aspect-square rounded-sm overflow-hidden border-2 border-primary/40"
      data-ocid={`candidate_portfolio.existing.item.${index + 1}`}
    >
      <img
        src={blob.getDirectURL()}
        alt={`Portfolio ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 hover:opacity-100 transition-smooth flex items-end justify-center pb-2">
        <span className="text-xs text-foreground font-medium">
          #{index + 1}
        </span>
      </div>
    </div>
  );
}

// ── Local image card (staged for upload) ─────────────────────────────────────
function LocalImageCard({
  img,
  onRemove,
  index,
}: {
  img: LocalImage;
  onRemove: (id: string) => void;
  index: number;
}) {
  return (
    <div
      className="relative aspect-square group"
      data-ocid={`candidate_portfolio.item.${index + 1}`}
    >
      <img
        src={img.preview}
        alt={img.file.name}
        className="w-full h-full object-cover rounded-sm border border-primary/20"
      />
      {/* Progress bar */}
      {img.progress > 0 && img.progress < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-background/60">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${img.progress}%` }}
          />
        </div>
      )}
      {/* Uploaded check */}
      {img.uploaded && (
        <div className="absolute inset-0 bg-background/40 flex items-center justify-center rounded-sm">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-primary-foreground"
              viewBox="0 0 12 12"
              fill="none"
              aria-label="Uploaded"
              role="img"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
      {/* Remove button */}
      {!img.uploaded && (
        <button
          type="button"
          onClick={() => onRemove(img.id)}
          className="absolute top-1 right-1 w-6 h-6 bg-background/80 border border-border/50 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/20 hover:border-destructive/40"
          aria-label="Remove image"
          data-ocid={`candidate_portfolio.delete_button.${index + 1}`}
        >
          <X className="w-3 h-3 text-destructive" />
        </button>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function CandidatePortfolioPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();

  const [localImages, setLocalImages] = useState<LocalImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const enabled = isAuthenticated && !!actor && !actorLoading;

  const { data: profile, isLoading: profileLoading } =
    useQuery<CandidateProfile | null>({
      queryKey: ["myProfile"],
      queryFn: () => actor!.getMyProfile().then((r) => r ?? null),
      enabled,
    });

  const existingImages: ExternalBlob[] = profile?.portfolioImages ?? [];
  const totalCount = existingImages.length + localImages.length;
  const remainingSlots = MAX_IMAGES - existingImages.length;

  // ── File processing ──────────────────────────────────────────────────
  const processFiles = useCallback(
    (files: File[]) => {
      const valid = files.filter((f) => ACCEPTED.includes(f.type));
      if (valid.length < files.length) {
        toast.warning("Some files were skipped (only JPG, PNG, WEBP allowed).");
      }
      const available = remainingSlots - localImages.length;
      if (valid.length > available) {
        toast.error(
          `Maximum ${MAX_IMAGES} portfolio images allowed. You can add ${available} more.`,
        );
        valid.splice(available);
      }
      if (valid.length === 0) return;
      const newImages: LocalImage[] = valid.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}`,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
      }));
      setLocalImages((prev) => [...prev, ...newImages]);
    },
    [remainingSlots, localImages.length],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const removeLocal = (id: string) => {
    setLocalImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  // ── Upload mutation ──────────────────────────────────────────────────
  const uploadMutation = useMutation({
    mutationFn: async () => {
      const toUpload = localImages.filter((i) => !i.uploaded);
      if (toUpload.length === 0) return;

      const blobs: ExternalBlob[] = await Promise.all(
        toUpload.map(async (img) => {
          const bytes = new Uint8Array(await img.file.arrayBuffer());
          return ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
            setLocalImages((prev) =>
              prev.map((i) => (i.id === img.id ? { ...i, progress: pct } : i)),
            );
          });
        }),
      );

      await actor!.uploadPortfolioImages(blobs);

      // Mark all as uploaded
      setLocalImages((prev) => prev.map((i) => ({ ...i, uploaded: true })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Portfolio images uploaded successfully! ✨");
      // Clear local after a short delay so user sees checkmarks
      setTimeout(() => {
        setLocalImages((prev) => {
          for (const i of prev) URL.revokeObjectURL(i.preview);
          return [];
        });
      }, 1500);
    },
    onError: () => {
      toast.error("Upload failed. Please try again.");
      setLocalImages((prev) =>
        prev.map((i) => ({ ...i, progress: 0, uploaded: false })),
      );
    },
  });

  // ── Guards ───────────────────────────────────────────────────────────
  if (isInitializing || actorLoading) {
    return (
      <CandidateLayout>
        <div
          className="max-w-3xl space-y-6"
          data-ocid="candidate_portfolio.loading_state"
        >
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </CandidateLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <CandidateLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <Crown className="w-10 h-10 text-primary/40" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            Login Required
          </h2>
          <Button
            onClick={login}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="candidate_portfolio.login_button"
          >
            Login with Internet Identity
          </Button>
        </div>
      </CandidateLayout>
    );
  }

  const pendingCount = localImages.filter((i) => !i.uploaded).length;

  return (
    <CandidateLayout>
      <div className="max-w-3xl space-y-6" data-ocid="candidate_portfolio.page">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              My Portfolio
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Apni best photos upload karo — maximum {MAX_IMAGES} images
            </p>
          </div>
          {pendingCount > 0 && (
            <Button
              type="button"
              onClick={() => uploadMutation.mutate()}
              disabled={uploadMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-smooth"
              data-ocid="candidate_portfolio.upload_button"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {pendingCount} Image{pendingCount !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Drag and drop zone */}
        {remainingSlots > 0 ? (
          <label
            htmlFor="portfolio-file-input"
            className={`relative border-2 border-dashed rounded-sm transition-smooth cursor-pointer block ${
              isDragOver
                ? "border-primary bg-primary/8 scale-[1.01]"
                : "border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            data-ocid="candidate_portfolio.dropzone"
            aria-label="Upload portfolio images"
          >
            <div className="flex flex-col items-center justify-center py-12 gap-3 pointer-events-none">
              <div
                className={`w-14 h-14 rounded-sm flex items-center justify-center transition-smooth ${
                  isDragOver ? "bg-primary/20" : "bg-primary/10"
                }`}
              >
                <ImageIcon
                  className={`w-7 h-7 transition-smooth ${
                    isDragOver ? "text-primary scale-110" : "text-primary/70"
                  }`}
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground text-sm">
                  {isDragOver
                    ? "Drop images here"
                    : "Drag & drop or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WEBP — Up to {remainingSlots} more image
                  {remainingSlots !== 1 ? "s" : ""} ({totalCount}/{MAX_IMAGES}{" "}
                  used)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="portfolio-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div
            className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-sm text-sm text-primary"
            data-ocid="candidate_portfolio.max_reached"
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            Maximum {MAX_IMAGES} portfolio images reached. Remove some to add
            new ones.
          </div>
        )}

        {/* Existing portfolio images */}
        {profileLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : existingImages.length > 0 ? (
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base text-foreground">
                Uploaded Images ({existingImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                data-ocid="candidate_portfolio.existing_list"
              >
                {existingImages.map((blob, idx) => (
                  <ExistingImageCard
                    key={blob.getDirectURL()}
                    blob={blob}
                    index={idx}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Local staged images */}
        {localImages.length > 0 && (
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base text-foreground">
                Ready to Upload ({localImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                data-ocid="candidate_portfolio.staged_list"
              >
                {localImages.map((img, idx) => (
                  <LocalImageCard
                    key={img.id}
                    img={img}
                    index={idx}
                    onRemove={removeLocal}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state when nothing */}
        {!profileLoading &&
          existingImages.length === 0 &&
          localImages.length === 0 && (
            <div
              className="text-center py-6 text-sm text-muted-foreground/60"
              data-ocid="candidate_portfolio.empty_state"
            >
              No portfolio images yet. Add your best photos above!
            </div>
          )}
      </div>
    </CandidateLayout>
  );
}
