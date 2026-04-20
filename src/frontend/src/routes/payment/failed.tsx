import { createActor } from "@/backend";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  RefreshCcw,
  XCircle,
} from "lucide-react";

export function PaymentFailedPage() {
  const { actor } = useActor(createActor);

  const configQuery = useQuery({
    queryKey: ["appConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getConfig();
    },
    enabled: !!actor,
  });

  const config = configQuery.data;

  return (
    <PublicLayout>
      <div
        className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-16 px-4"
        data-ocid="payment_failed.page"
      >
        <div className="max-w-md w-full text-center space-y-7">
          {/* Error icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-destructive/10 border-2 border-destructive/25 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground/60 font-body">
              Dream Capture India
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Payment Could Not Be
              <br />
              <span className="text-destructive">Processed</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Aapka payment process nahi hua. Koi bank charge hua hai to 5–7
              business days mein refund ho jayega.
            </p>
          </div>

          {/* Retry guidance */}
          <div className="bg-card border border-border/60 rounded-sm px-6 py-5 text-left space-y-3">
            <p className="text-xs text-muted-foreground/70 uppercase tracking-widest">
              Common Reasons &amp; Fixes
            </p>
            {[
              {
                reason: "Card declined",
                fix: "Try a different card or check your bank limits",
              },
              {
                reason: "Insufficient funds",
                fix: "Ensure your account has at least ₹1499 balance",
              },
              {
                reason: "Session expired",
                fix: "Refresh and click the Pay button again",
              },
              {
                reason: "Network error",
                fix: "Check your internet connection and retry",
              },
            ].map((item) => (
              <div key={item.reason} className="flex items-start gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-2" />
                <div>
                  <span className="text-foreground/80 font-medium">
                    {item.reason}:{" "}
                  </span>
                  <span className="text-muted-foreground">{item.fix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/apply" data-ocid="payment_failed.try_again_button">
              <Button
                type="button"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-smooth"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
            <Link to="/" data-ocid="payment_failed.back_home_link">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-border/60"
              >
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Contact support */}
          <div
            className="bg-card border border-border/50 rounded-sm px-6 py-5 text-left space-y-3"
            data-ocid="payment_failed.support_section"
          >
            <p className="text-xs text-muted-foreground/70 uppercase tracking-widest">
              Need Help? Contact Support
            </p>

            {configQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <>
                {config?.whatsappNumber && (
                  <a
                    href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-muted/40 border border-border/40 rounded-sm hover:border-primary/30 transition-smooth group"
                    data-ocid="payment_failed.whatsapp_link"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-smooth">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground/70">
                        WhatsApp Support
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {config.whatsappNumber}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 ml-auto shrink-0 group-hover:text-primary transition-smooth" />
                  </a>
                )}

                {config?.email && (
                  <a
                    href={`mailto:${config.email}`}
                    className="flex items-center gap-3 p-3 bg-muted/40 border border-border/40 rounded-sm hover:border-primary/30 transition-smooth group"
                    data-ocid="payment_failed.email_link"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-smooth">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground/70">
                        Email Support
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {config.email}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 ml-auto shrink-0 group-hover:text-primary transition-smooth" />
                  </a>
                )}

                {!config?.whatsappNumber && !config?.email && (
                  <p className="text-sm text-muted-foreground/60">
                    Contact information unavailable. Please try again later.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
