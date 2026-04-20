import type { AppConfig } from "@/backend.d";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/use-backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  DollarSign,
  Info,
  Instagram,
  Mail,
  Phone,
  Save,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function FieldRow({
  icon: Icon,
  label,
  children,
}: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-sm">
        <Icon className="w-3.5 h-3.5 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  );
}

export function AdminSettingsPage() {
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();

  const [config, setConfig] = useState({
    stripePublicKey: "",
    paymentAmountDisplay: "1499",
    whatsappNumber: "",
    email: "",
    instagramHandle: "",
  });

  const { data: remoteConfig, isLoading: configLoading } = useQuery<AppConfig>({
    queryKey: ["admin", "config"],
    queryFn: () => actor!.getConfig(),
    enabled: !!actor && !actorLoading,
  });

  useEffect(() => {
    if (remoteConfig) {
      setConfig({
        stripePublicKey: remoteConfig.stripePublicKey,
        paymentAmountDisplay: String(Number(remoteConfig.paymentAmount) / 100),
        whatsappNumber: remoteConfig.whatsappNumber,
        email: remoteConfig.email,
        instagramHandle: remoteConfig.instagramHandle,
      });
    }
  }, [remoteConfig]);

  const updateMutation = useMutation({
    mutationFn: (newConfig: AppConfig) => actor!.updateConfig(newConfig),
    onSuccess: () => {
      toast.success("Configuration saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "config"] });
    },
    onError: () => toast.error("Failed to save configuration."),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number.parseFloat(config.paymentAmountDisplay);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }
    const newConfig: AppConfig = {
      stripePublicKey: config.stripePublicKey,
      paymentAmount: BigInt(Math.round(amountNum * 100)),
      whatsappNumber: config.whatsappNumber,
      email: config.email,
      instagramHandle: config.instagramHandle,
    };
    updateMutation.mutate(newConfig);
  };

  const isLoading = configLoading || actorLoading;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl" data-ocid="admin_settings.page">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Centralized configuration for Dream Capture India
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4" data-ocid="admin_settings.loading_state">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Platform Config */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Platform Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <FieldRow icon={DollarSign} label="Onboarding Fee (₹)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      ₹
                    </span>
                    <Input
                      id="paymentAmountDisplay"
                      name="paymentAmountDisplay"
                      type="number"
                      min="1"
                      step="1"
                      value={config.paymentAmountDisplay}
                      onChange={handleChange}
                      placeholder="1499"
                      className="bg-input border-border/50 pl-7"
                      data-ocid="admin_settings.payment_amount_input"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Stored as paise internally (₹{config.paymentAmountDisplay} ={" "}
                    {Math.round(
                      Number.parseFloat(config.paymentAmountDisplay || "0") *
                        100,
                    )}{" "}
                    paise)
                  </p>
                </FieldRow>

                <FieldRow icon={Phone} label="WhatsApp Number">
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={config.whatsappNumber}
                    onChange={handleChange}
                    placeholder="+919999999999"
                    className="bg-input border-border/50"
                    data-ocid="admin_settings.whatsapp_input"
                  />
                </FieldRow>

                <FieldRow icon={Mail} label="Contact Email">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={config.email}
                    onChange={handleChange}
                    placeholder="contact@dreamcaptureindia.com"
                    className="bg-input border-border/50"
                    data-ocid="admin_settings.email_input"
                  />
                </FieldRow>

                <FieldRow icon={Instagram} label="Instagram Handle">
                  <Input
                    id="instagramHandle"
                    name="instagramHandle"
                    value={config.instagramHandle}
                    onChange={handleChange}
                    placeholder="@dreamcaptureindia"
                    className="bg-input border-border/50"
                    data-ocid="admin_settings.instagram_input"
                  />
                </FieldRow>
              </CardContent>
            </Card>

            {/* Stripe Config */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-base text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Stripe Payment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <FieldRow icon={CreditCard} label="Stripe Public Key">
                  <Input
                    id="stripePublicKey"
                    name="stripePublicKey"
                    value={config.stripePublicKey}
                    onChange={handleChange}
                    placeholder="pk_live_..."
                    className="bg-input border-border/50 font-mono text-sm"
                    data-ocid="admin_settings.stripe_public_key_input"
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Only the public key is stored here. Secret key is managed
                    separately.
                  </p>
                </FieldRow>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold min-w-36"
                data-ocid="admin_settings.save_button"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save All Settings"}
              </Button>
            </div>

            {/* Success state */}
            {updateMutation.isSuccess && (
              <div
                className="p-3 bg-green-500/10 border border-green-500/30 rounded-sm"
                data-ocid="admin_settings.success_state"
              >
                <p className="text-sm text-green-600 font-medium">
                  ✓ Configuration saved and applied.
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
