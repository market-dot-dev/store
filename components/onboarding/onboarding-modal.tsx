"use client";

import { User } from "@/app/generated/prisma";
import { organizationIsMarketExpert, validateMarketExpert } from "@/app/services/market-service";
import { refreshAndGetState } from "@/app/services/onboarding/onboarding-service";
import { OnboardingState } from "@/app/services/onboarding/onboarding-steps";
import { updateCurrentOrganizationBusiness } from "@/app/services/organization/organization-service";
import { createSite, updateCurrentSite } from "@/app/services/site/site-crud-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { SiteDetails } from "@/types/site";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/themes";
import { AlertCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LoadingDots from "../icons/loading-dots";
import OfferingsForm from "./offerings-form";
import ProfileForm from "./profile-form";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

interface ProfileData {
  businessName: string;
  subdomain: string;
  logo?: string;
  location: string;
  teamType: "team" | "individual";
}

interface OfferingsData {
  offerings: string[];
}

// Internal UI components
const LoadingState = () => (
  <div className="flex size-10 items-center justify-center">
    <LoadingDots />
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex size-full flex-col items-center justify-center gap-4">
    <AlertCircleIcon className="size-5" />
    <p className="text-md">{error}</p>
    <Button onClick={onRetry}>Try again</Button>
  </div>
);

const FormContent = ({
  step,
  user,
  currentSite,
  isLoading,
  onProfileSubmit,
  onOfferingsSubmit,
  formRef
}: {
  step: "profile" | "offerings";
  user: User;
  currentSite?: SiteDetails;
  isLoading: boolean;
  onProfileSubmit: (data: ProfileData) => void;
  onOfferingsSubmit: (data: OfferingsData) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
}) => (
  <div className="w-full overflow-y-auto">
    <div className="flex w-full items-center justify-center p-6 sm:p-9">
      {step === "profile" ? (
        <ProfileForm
          user={user}
          currentSite={currentSite}
          onSubmit={onProfileSubmit}
          formRef={formRef}
        />
      ) : (
        <OfferingsForm
          user={user}
          onSubmit={onOfferingsSubmit}
          isLoading={isLoading}
          formRef={formRef}
        />
      )}
    </div>
  </div>
);

const NavigationButtons = ({
  step,
  isLoading,
  onBack,
  onSubmit
}: {
  step: "profile" | "offerings";
  isLoading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) => (
  <div className="flex w-full justify-between">
    {step === "offerings" && (
      <Button variant="ghost" size="lg" onClick={onBack} type="button">
        Back
      </Button>
    )}
    <Button
      type="button"
      size="lg"
      disabled={isLoading}
      loading={isLoading}
      onClick={onSubmit}
      className="ml-auto"
    >
      {step === "profile" ? "Next" : "Finish"}
    </Button>
  </div>
);

type OnboardingModalProps = {
  user: User;
  currentSite?: SiteDetails;
  onboardingState: OnboardingState;
  organization: {
    id: string;
    marketExpertId: string | null;
  };
};

export function OnboardingModal({
  user,
  currentSite,
  onboardingState,
  organization
}: OnboardingModalProps) {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const [isOpen, setIsOpen] = useState(
    !onboardingState.setupBusiness ||
      !onboardingState.preferredServices ||
      (!organization.marketExpertId && searchParams.get("source") === "market.dev")
  );

  const [isMarketExpert, setIsMarketExpert] = useState<boolean | null>(null);
  const [isLoadingMarketExpert, setIsLoadingMarketExpert] = useState(false);
  const [validateMarketExpertError, setValidateMarketExpertError] = useState<string | null>(null);
  const [step, setStep] = useState<"profile" | "offerings">("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const router = useRouter();
  const source = searchParams.get("source");
  const sourceIsMarketDev = source === "market.dev";
  const mounted = useMounted();

  // Check if organization is market expert on mount
  useEffect(() => {
    const checkMarketExpert = async () => {
      try {
        const isExpert = await organizationIsMarketExpert();
        setIsMarketExpert(isExpert);
      } catch (error) {
        console.error("Error checking market expert status:", error);
        setIsMarketExpert(false);
      }
    };

    if (mounted) {
      checkMarketExpert();
    }
  }, [mounted]);

  // Handle market.dev connection if needed
  useEffect(() => {
    if (!mounted || !sourceIsMarketDev || isMarketExpert !== null) return;

    const connectMarketExpert = async () => {
      setIsLoadingMarketExpert(true);
      try {
        const success = await validateMarketExpert();
        if (success && sourceIsMarketDev) {
          toast.success("Market.dev account connected successfully");
          setIsMarketExpert(true);
        } else if (!success && sourceIsMarketDev) {
          setValidateMarketExpertError(
            "Failed to connect your Market.dev account. Make sure you have an account on Market.dev."
          );
          setIsMarketExpert(false);
        }
      } catch (error) {
        setValidateMarketExpertError("Error connecting to market.dev");
        setIsMarketExpert(false);
      } finally {
        setIsLoadingMarketExpert(false);
      }
    };

    connectMarketExpert();
  }, [mounted, sourceIsMarketDev, isMarketExpert]);

  const handleProfileSubmit = (data: ProfileData) => {
    setProfileData(data);
    setStep("offerings");
  };

  const handleFinalSubmit = async (offeringsData: OfferingsData) => {
    if (!profileData) return;

    setIsLoading(true);
    try {
      // Update organization business data
      await updateCurrentOrganizationBusiness({
        name: profileData.businessName,
        businessLocation: profileData.location,
        businessType: profileData.teamType
      });

      // Handle site creation/update
      if (currentSite) {
        const formData = new FormData();
        formData.append("subdomain", profileData.subdomain);
        if (profileData.logo) {
          formData.append("logoURL", profileData.logo);
        }
        await updateCurrentSite(formData);
      } else {
        // Create site for the organization
        await createSite(organization.id, profileData.subdomain, profileData.logo);
      }

      // Update onboarding state
      await refreshAndGetState(offeringsData.offerings);

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setError("Failed to complete onboarding");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  const handleRetry = () => window.location.reload();

  // Note: unless source is market.dev where user is intentionally trying to connect their market.dev account, we shouldn't surface connection errors
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <VisuallyHidden>
        <DialogTitle>Welcome to market.dev</DialogTitle>
        <DialogDescription>Tell us about your business</DialogDescription>
      </VisuallyHidden>
      <DialogContent
        className="flex max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] flex-col items-center rounded-lg bg-stone-100 p-0 sm:max-h-[calc(100vh-48px)] sm:max-w-xl"
        hideCloseButton
        preventOutsideClose
      >
        {isLoadingMarketExpert ? (
          <LoadingState />
        ) : sourceIsMarketDev && validateMarketExpertError ? (
          <ErrorState error={validateMarketExpertError} onRetry={handleRetry} />
        ) : (
          <>
            <FormContent
              step={step}
              user={user}
              currentSite={currentSite}
              isLoading={isLoading}
              onProfileSubmit={handleProfileSubmit}
              onOfferingsSubmit={handleFinalSubmit}
              formRef={formRef}
            />
            <DialogFooter className="w-full border-t border-stone-200 px-6 py-4 sm:px-9">
              <NavigationButtons
                step={step}
                isLoading={isLoading}
                onBack={() => setStep("profile")}
                onSubmit={handleSubmitClick}
              />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
