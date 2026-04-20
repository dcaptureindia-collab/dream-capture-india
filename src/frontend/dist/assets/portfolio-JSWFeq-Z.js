import { c as useQueryClient, r as reactExports, a as ue, j as jsxRuntimeExports } from "./index-CebTjiTu.js";
import { c as createLucideIcon, b as useBackend, d as useQuery, C as Crown, B as Button, E as ExternalBlob, X } from "./x-CNxy1RBN.js";
import { C as CandidateLayout } from "./CandidateLayout-DFbBKuL5.js";
import { u as useAuth, C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CzpBPjzC.js";
import { S as Skeleton } from "./skeleton-DY9N9Ttl.js";
import { u as useMutation } from "./useMutation-COpRj0Fj.js";
import { L as LoaderCircle } from "./loader-circle-B0D6aYu_.js";
import { I as Image } from "./image-BwURnjpr.js";
import "./badge-Bz0HIF4P.js";
import "./user-CLcws5yd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const MAX_IMAGES = 10;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
function ExistingImageCard({
  blob,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative aspect-square rounded-sm overflow-hidden border-2 border-primary/40",
      "data-ocid": `candidate_portfolio.existing.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: blob.getDirectURL(),
            alt: `Portfolio ${index + 1}`,
            className: "w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 hover:opacity-100 transition-smooth flex items-end justify-center pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-foreground font-medium", children: [
          "#",
          index + 1
        ] }) })
      ]
    }
  );
}
function LocalImageCard({
  img,
  onRemove,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative aspect-square group",
      "data-ocid": `candidate_portfolio.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: img.preview,
            alt: img.file.name,
            className: "w-full h-full object-cover rounded-sm border border-primary/20"
          }
        ),
        img.progress > 0 && img.progress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1.5 bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full bg-primary transition-all duration-300",
            style: { width: `${img.progress}%` }
          }
        ) }),
        img.uploaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/40 flex items-center justify-center rounded-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            className: "w-3.5 h-3.5 text-primary-foreground",
            viewBox: "0 0 12 12",
            fill: "none",
            "aria-label": "Uploaded",
            role: "img",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: "M2 6l3 3 5-5",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            )
          }
        ) }) }),
        !img.uploaded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onRemove(img.id),
            className: "absolute top-1 right-1 w-6 h-6 bg-background/80 border border-border/50 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/20 hover:border-destructive/40",
            "aria-label": "Remove image",
            "data-ocid": `candidate_portfolio.delete_button.${index + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 text-destructive" })
          }
        )
      ]
    }
  );
}
function CandidatePortfolioPage() {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();
  const [localImages, setLocalImages] = reactExports.useState([]);
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const enabled = isAuthenticated && !!actor && !actorLoading;
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => actor.getMyProfile().then((r) => r ?? null),
    enabled
  });
  const existingImages = (profile == null ? void 0 : profile.portfolioImages) ?? [];
  const totalCount = existingImages.length + localImages.length;
  const remainingSlots = MAX_IMAGES - existingImages.length;
  const processFiles = reactExports.useCallback(
    (files) => {
      const valid = files.filter((f) => ACCEPTED.includes(f.type));
      if (valid.length < files.length) {
        ue.warning("Some files were skipped (only JPG, PNG, WEBP allowed).");
      }
      const available = remainingSlots - localImages.length;
      if (valid.length > available) {
        ue.error(
          `Maximum ${MAX_IMAGES} portfolio images allowed. You can add ${available} more.`
        );
        valid.splice(available);
      }
      if (valid.length === 0) return;
      const newImages = valid.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}`,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false
      }));
      setLocalImages((prev) => [...prev, ...newImages]);
    },
    [remainingSlots, localImages.length]
  );
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const removeLocal = (id) => {
    setLocalImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };
  const uploadMutation = useMutation({
    mutationFn: async () => {
      const toUpload = localImages.filter((i) => !i.uploaded);
      if (toUpload.length === 0) return;
      const blobs = await Promise.all(
        toUpload.map(async (img) => {
          const bytes = new Uint8Array(await img.file.arrayBuffer());
          return ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
            setLocalImages(
              (prev) => prev.map((i) => i.id === img.id ? { ...i, progress: pct } : i)
            );
          });
        })
      );
      await actor.uploadPortfolioImages(blobs);
      setLocalImages((prev) => prev.map((i) => ({ ...i, uploaded: true })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      ue.success("Portfolio images uploaded successfully! ✨");
      setTimeout(() => {
        setLocalImages((prev) => {
          for (const i of prev) URL.revokeObjectURL(i.preview);
          return [];
        });
      }, 1500);
    },
    onError: () => {
      ue.error("Upload failed. Please try again.");
      setLocalImages(
        (prev) => prev.map((i) => ({ ...i, progress: 0, uploaded: false }))
      );
    }
  });
  if (isInitializing || actorLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-3xl space-y-6",
        "data-ocid": "candidate_portfolio.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-60 w-full" })
        ]
      }
    ) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-64 gap-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-10 h-10 text-primary/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Login Required" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: login,
          className: "bg-primary text-primary-foreground hover:bg-primary/90",
          "data-ocid": "candidate_portfolio.login_button",
          children: "Login with Internet Identity"
        }
      )
    ] }) });
  }
  const pendingCount = localImages.filter((i) => !i.uploaded).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CandidateLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-6", "data-ocid": "candidate_portfolio.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "My Portfolio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-1 text-sm", children: [
          "Apni best photos upload karo — maximum ",
          MAX_IMAGES,
          " images"
        ] })
      ] }),
      pendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: () => uploadMutation.mutate(),
          disabled: uploadMutation.isPending,
          className: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-smooth",
          "data-ocid": "candidate_portfolio.upload_button",
          children: uploadMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Uploading..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
            "Upload ",
            pendingCount,
            " Image",
            pendingCount !== 1 ? "s" : ""
          ] })
        }
      )
    ] }),
    remainingSlots > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "label",
      {
        htmlFor: "portfolio-file-input",
        className: `relative border-2 border-dashed rounded-sm transition-smooth cursor-pointer block ${isDragOver ? "border-primary bg-primary/8 scale-[1.01]" : "border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5"}`,
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        "data-ocid": "candidate_portfolio.dropzone",
        "aria-label": "Upload portfolio images",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-3 pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-14 h-14 rounded-sm flex items-center justify-center transition-smooth ${isDragOver ? "bg-primary/20" : "bg-primary/10"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Image,
                  {
                    className: `w-7 h-7 transition-smooth ${isDragOver ? "text-primary scale-110" : "text-primary/70"}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm", children: isDragOver ? "Drop images here" : "Drag & drop or click to browse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                "JPG, PNG, WEBP — Up to ",
                remainingSlots,
                " more image",
                remainingSlots !== 1 ? "s" : "",
                " (",
                totalCount,
                "/",
                MAX_IMAGES,
                " ",
                "used)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              id: "portfolio-file-input",
              type: "file",
              accept: "image/jpeg,image/png,image/webp",
              multiple: true,
              className: "hidden",
              onChange: handleFileChange
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-sm text-sm text-primary",
        "data-ocid": "candidate_portfolio.max_reached",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4 shrink-0" }),
          "Maximum ",
          MAX_IMAGES,
          " portfolio images reached. Remove some to add new ones."
        ]
      }
    ),
    profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }, i)) }) : existingImages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground", children: [
        "Uploaded Images (",
        existingImages.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
          "data-ocid": "candidate_portfolio.existing_list",
          children: existingImages.map((blob, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ExistingImageCard,
            {
              blob,
              index: idx
            },
            blob.getDirectURL()
          ))
        }
      ) })
    ] }) : null,
    localImages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base text-foreground", children: [
        "Ready to Upload (",
        localImages.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
          "data-ocid": "candidate_portfolio.staged_list",
          children: localImages.map((img, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            LocalImageCard,
            {
              img,
              index: idx,
              onRemove: removeLocal
            },
            img.id
          ))
        }
      ) })
    ] }),
    !profileLoading && existingImages.length === 0 && localImages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "text-center py-6 text-sm text-muted-foreground/60",
        "data-ocid": "candidate_portfolio.empty_state",
        children: "No portfolio images yet. Add your best photos above!"
      }
    )
  ] }) });
}
export {
  CandidatePortfolioPage
};
