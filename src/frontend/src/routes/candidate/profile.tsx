import type { CandidateProfile, CandidateProfileInput } from "@/backend";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  city: string;
  age: string;
  height: string;
  measurements: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="text-xs text-destructive mt-1"
      data-ocid="candidate_profile.field_error"
    >
      {message}
    </p>
  );
}

export function CandidateProfilePage() {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      age: "",
      height: "",
      measurements: "",
    },
  });

  // Pre-populate form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        city: profile.city,
        age: String(profile.age),
        height: profile.height,
        measurements: profile.measurements,
      });
    }
  }, [profile, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const input: CandidateProfileInput = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        age: BigInt(data.age),
        height: data.height.trim(),
        measurements: data.measurements.trim(),
      };
      if (profile) {
        return actor!.updateMyProfile(input);
      }
      return actor!.registerCandidate(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      toast.success("Profile saved successfully! 🎉");
    },
    onError: () => {
      toast.error("Failed to save profile. Please try again.");
    },
  });

  const onSubmit = (data: ProfileFormValues) => saveMutation.mutate(data);

  // ── Loading ────────────────────────────────────────────────────────────
  if (isInitializing || actorLoading) {
    return (
      <CandidateLayout>
        <div
          className="max-w-2xl space-y-6"
          data-ocid="candidate_profile.loading_state"
        >
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-80 w-full" />
        </div>
      </CandidateLayout>
    );
  }

  // ── Not authenticated ──────────────────────────────────────────────────
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
            data-ocid="candidate_profile.login_button"
          >
            Login with Internet Identity
          </Button>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="max-w-2xl space-y-6" data-ocid="candidate_profile.page">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {profile ? "Edit Profile" : "Complete Registration"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Apni details fill karo taaki casting directors aapko shortlist kar
            sakein
          </p>
        </div>

        {profileLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-base text-foreground">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Aapka poora naam"
                    className="bg-input border-border/50"
                    data-ocid="candidate_profile.name_input"
                    {...register("name", {
                      required: "Full name is required",
                      minLength: { value: 2, message: "Name too short" },
                    })}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="bg-input border-border/50"
                    data-ocid="candidate_profile.email_input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  <FieldError message={errors.email?.message} />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone / WhatsApp *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    className="bg-input border-border/50"
                    data-ocid="candidate_profile.phone_input"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Phone must be exactly 10 digits",
                      },
                    })}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Mumbai, Delhi, Bangalore..."
                    className="bg-input border-border/50"
                    data-ocid="candidate_profile.city_input"
                    {...register("city", { required: "City is required" })}
                  />
                  <FieldError message={errors.city?.message} />
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="18"
                    className="bg-input border-border/50"
                    data-ocid="candidate_profile.age_input"
                    {...register("age", {
                      required: "Age is required",
                      min: { value: 16, message: "Minimum age is 16" },
                      max: { value: 60, message: "Maximum age is 60" },
                      validate: (v) =>
                        Number.isInteger(Number(v)) || "Enter a valid age",
                    })}
                  />
                  <FieldError message={errors.age?.message} />
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                  <Label htmlFor="height">Height *</Label>
                  <Input
                    id="height"
                    placeholder="165 cm or 5'5&quot;"
                    className="bg-input border-border/50"
                    data-ocid="candidate_profile.height_input"
                    {...register("height", { required: "Height is required" })}
                  />
                  <FieldError message={errors.height?.message} />
                </div>

                {/* Measurements */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="measurements">
                    Measurements (Bust-Waist-Hip) *
                  </Label>
                  <Input
                    id="measurements"
                    placeholder="34-26-36"
                    className="bg-input border-border/50"
                    data-ocid="candidate_profile.measurements_input"
                    {...register("measurements", {
                      required: "Measurements are required",
                    })}
                  />
                  <FieldError message={errors.measurements?.message} />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={isSubmitting || saveMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-smooth"
                data-ocid="candidate_profile.save_button"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting || saveMutation.isPending
                  ? "Saving..."
                  : profile
                    ? "Update Profile"
                    : "Register & Save"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </CandidateLayout>
  );
}
