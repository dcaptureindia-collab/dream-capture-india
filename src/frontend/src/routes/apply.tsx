import { createActor } from "@/backend";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CheckoutSession {
  id: string;
  url: string;
}

const INCLUSIONS = [
  {
    text: "Profile Setup & Verification",
    desc: "Professional profile on the platform",
  },
  {
    text: "Portfolio Creation Support",
    desc: "Upload up to 10 high-quality images",
  },
  {
    text: "Access to Premium Projects",
    desc: "Fashion, bridal, web series & more",
  },
  {
    text: "Admin Review & Onboarding",
    desc: "Expert team reviews your application",
  },
  {
    text: "Candidate Dashboard Access",
    desc: "Real-time casting updates & notifications",
  },
  {
    text: "WhatsApp Registration Confirmation",
    desc: "Instant confirmation on payment",
  },
];

export function ApplyPage() {
  const { actor } = useActor(createActor);
  const { isAuthenticated, login, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const [error, setError] = useState<string | null>(null);

  const checkout = useMutation({
    mutationFn: async (): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/payment/failed`;
      const result = await actor.createCheckoutSession(successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
    onSuccess: (session) => {
      window.location.href = session.url;
    },
    onError: (err: Error) => {
      setError(err.message ?? "Payment initiation failed. Please try again.");
      toast.error("Payment failed to initiate. Please try again.");
    },
  });

  const handlePay = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setError(null);
    checkout.mutate();
  };

  const isLoading = isInitializing || isLoggingIn || checkout.isPending;

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full space-y-8" data-ocid="apply.page">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-primary/70 font-body mb-2">
                Dream Capture India
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Begin Your Modelling
                <br />
                <span className="text-primary">Journey Today</span>
              </h1>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                India's premier casting platform connecting talented models with
                top brands, designers &amp; production houses.
              </p>
            </div>
          </div>

          {/* Registration Fee Card */}
          <div
            className="bg-card border border-primary/25 rounded-sm overflow-hidden shadow-luxury"
            data-ocid="apply.fee_card"
          >
            {/* Card Header */}
            <div className="bg-secondary/80 border-b border-primary/20 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary/60 font-body">
                  One-time Onboarding Fee
                </p>
                <p className="font-display text-2xl font-bold text-primary mt-0.5">
                  ₹1499
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Registration &amp;
                </p>
                <p className="text-xs text-muted-foreground">Profile Setup</p>
              </div>
            </div>

            {/* Inclusions */}
            <div className="px-6 py-5">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-4">
                What's Included
              </p>
              <ul className="space-y-3">
                {INCLUSIONS.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.text}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6 space-y-3">
              {error && (
                <div
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-sm text-destructive"
                  data-ocid="apply.error_state"
                >
                  {error}
                </div>
              )}

              <Button
                type="button"
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base transition-smooth shadow-luxury h-12"
                onClick={handlePay}
                disabled={isLoading}
                data-ocid="apply.pay_button"
              >
                {isInitializing || isLoggingIn
                  ? "Authenticating..."
                  : checkout.isPending
                    ? "Redirecting to Payment..."
                    : !isAuthenticated
                      ? "Login & Pay ₹1499"
                      : "Pay ₹1499 & Start Your Journey"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-muted-foreground/60 text-center">
                  You'll be asked to login with Internet Identity before
                  proceeding to payment
                </p>
              )}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div
            className="flex items-start gap-2.5 p-4 bg-muted/40 border border-border/50 rounded-sm"
            data-ocid="apply.disclaimer"
          >
            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              <strong className="text-muted-foreground/80 font-medium">
                Important Disclaimer:
              </strong>{" "}
              ₹1499 onboarding fee is for verification &amp; profile setup only.
              It does not guarantee job placement or casting selection.
              Shortlisting is based on client requirements. Post selection, 20%
              advance may be paid with remainder on shoot completion.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
