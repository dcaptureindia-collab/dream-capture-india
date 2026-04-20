import { createActor } from "@/backend";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Crown,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const REDIRECT_DELAY = 3;

export function PaymentSuccessPage() {
  const { actor } = useActor(createActor);
  const search = useSearch({ strict: false }) as Record<string, string>;
  const sessionId = search?.session_id ?? "";

  const [countdown, setCountdown] = useState(REDIRECT_DELAY);
  const [redirected, setRedirected] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Verify payment status
  const statusQuery = useQuery({
    queryKey: ["stripeSessionStatus", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) throw new Error("Missing session");
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !!sessionId,
    retry: 2,
  });

  const isVerified = statusQuery.data?.__kind__ === "completed";
  const isFailed = statusQuery.data?.__kind__ === "failed";

  // 2. Record payment once verified
  const { mutate: recordMutate } = useMutation({
    mutationFn: async () => {
      if (!actor || !sessionId) throw new Error("Missing actor or session");
      return actor.recordPayment(sessionId);
    },
  });

  const recordCalledRef = useRef(false);
  useEffect(() => {
    if (isVerified && !recordCalledRef.current) {
      recordCalledRef.current = true;
      recordMutate();
    }
  }, [isVerified, recordMutate]);

  // 3. Auto-redirect countdown once verified
  useEffect(() => {
    if (!isVerified) return;
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setRedirected(true);
          window.location.href = "/candidate/profile";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isVerified]);

  // Loading state
  if (statusQuery.isLoading) {
    return (
      <PublicLayout>
        <div
          className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4"
          data-ocid="payment_success.loading_state"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-9 h-9 text-primary animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Verifying your payment…
            </p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Payment not verified / failed
  if (isFailed || (!sessionId && !statusQuery.isLoading)) {
    const errMsg =
      statusQuery.data?.__kind__ === "failed"
        ? statusQuery.data.failed.error
        : "Session ID is missing. Payment could not be verified.";

    return (
      <PublicLayout>
        <div
          className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4"
          data-ocid="payment_success.error_state"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-destructive/10 border border-destructive/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-9 h-9 text-destructive" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Verification Failed
              </h1>
              <p className="text-sm text-muted-foreground">{errMsg}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/apply" data-ocid="payment_success.retry_link">
                <Button
                  type="button"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-smooth"
                >
                  Try Again <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Success state
  return (
    <PublicLayout>
      <div
        className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4"
        data-ocid="payment_success.page"
      >
        <div className="max-w-md w-full text-center space-y-7">
          {/* Gold checkmark */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 border-2 border-primary/40 rounded-full flex items-center justify-center shadow-luxury">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] uppercase text-primary/70 font-body">
              Dream Capture India
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Payment Successful!
            </h1>
            <p className="text-lg font-display text-primary">
              ₹1499 Verified ✓
            </p>
          </div>

          {/* Welcome message */}
          <div className="bg-card border border-primary/20 rounded-sm px-6 py-5 space-y-1">
            <p className="font-display font-semibold text-foreground text-base">
              Welcome to Dream Capture India!
            </p>
            <p className="text-sm text-muted-foreground">
              Aapka registration successful raha. Ab apna profile complete
              karein.
            </p>
          </div>

          {/* Next steps */}
          <div className="bg-card border border-border/60 rounded-sm p-5 text-left space-y-3">
            <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-1">
              Next Steps
            </p>
            {[
              "Complete your candidate profile",
              "Upload your portfolio images",
              "WhatsApp confirmation will be sent shortly",
              "Our team will review and onboard you",
            ].map((step, i) => (
              <div
                key={step}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <span className="w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* Auto-redirect */}
          {!redirected && (
            <p
              className="text-sm text-muted-foreground"
              data-ocid="payment_success.redirect_countdown"
            >
              Redirecting to your profile in{" "}
              <span className="font-bold text-primary">{countdown}s</span>…
            </p>
          )}

          {/* Manual link */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/candidate/profile"
              data-ocid="payment_success.go_to_profile_button"
            >
              <Button
                type="button"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-smooth"
              >
                Complete Profile <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link
              to="/candidate/dashboard"
              data-ocid="payment_success.go_to_dashboard_link"
            >
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-border/60"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground/50">
            If the redirect doesn't happen,{" "}
            <Link
              to="/candidate/profile"
              className="underline text-primary/70 hover:text-primary transition-colors"
              data-ocid="payment_success.manual_redirect_link"
            >
              click here
            </Link>{" "}
            to go to your profile.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
