import { StripeAccountStatus } from "@/app/app/(dashboard)/settings/payment/stripe-account-status";
import { ONBOARDING_STEPS, getNextStepPath } from "@/app/services/onboarding/onboarding-steps";
import {
  checkVendorStripeStatus,
  getVendorStripeConnectURL
} from "@/app/services/stripe/stripe-vendor-service";
import { requireOrganization } from "@/app/services/user-context-service";
import { OnboardingAction } from "@/components/onboarding/onboarding-action";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { CreditCard, LinkIcon, Mail, RefreshCw, Settings } from "lucide-react";

export default async function StripeOnboardingPage() {
  const org = await requireOrganization();
  const hasStripeHistory = !!org.stripeAccountId || org.stripeAccountDisabled;
  const oauthUrl = await getVendorStripeConnectURL("/onboarding/stripe/callback");
  const { canSell, messageCodes, disabledReasons } = await checkVendorStripeStatus(true);

  const currentStep = ONBOARDING_STEPS["stripe"];
  const nextPath = getNextStepPath(currentStep.name);

  return (
    <div className="mx-auto max-w-md">
      <div className="space-y-10">
        <OnboardingHeader title={currentStep.title} description={currentStep.description} />

        <StripeAccountStatus
          canSell={canSell}
          messageCodes={messageCodes}
          disabledReasons={disabledReasons}
          isAccountDisconnected={org.stripeAccountDisabled && !org.stripeAccountId}
          oauthUrl={oauthUrl}
          hasStripeHistory={hasStripeHistory}
        />

        <div className="space-y-8">
          {/* What you need Stripe for */}
          {!canSell && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">You'll need Stripe to:</h3>
              <div className="flex items-start space-x-3">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Accept credit card payments</p>
                  <p className="text-muted-foreground">
                    Let customers pay for your services directly.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RefreshCw className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Offer subscription services</p>
                  <p className="text-muted-foreground">
                    Set up recurring payments for ongoing services.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* What you can do */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {canSell
                ? "With your Stripe account connected, you can:"
                : "Without Stripe, you can still:"}
            </h3>
            {canSell && (
              <>
                <div className="flex items-start space-x-3">
                  <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Accept credit card payments</p>
                    <p className="text-muted-foreground">
                      Let customers pay for your services directly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RefreshCw className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Offer subscription services</p>
                    <p className="text-muted-foreground">
                      Set up recurring payments for ongoing services.
                    </p>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-start space-x-3">
              <LinkIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Create checkout links</p>
                <p className="text-muted-foreground">
                  Use our purpose-built checkout pages to offer services.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">Use contact forms</p>
                <p className="text-muted-foreground">
                  Collect leads details from your checkout page & get in touch with interested
                  customers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OnboardingAction
            currentStep={currentStep.name}
            nextPath={nextPath}
            variant={canSell ? "default" : "secondary"}
            label={canSell ? "Continue" : "Skip for now"}
          />
          <p className="text-center text-xs text-muted-foreground">
            You can always connect Stripe later from your{" "}
            <span className="font-medium text-stone-700">
              <Settings className="ml-px mr-1 inline-block size-3.5 -translate-y-px" />
              Settings
            </span>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
