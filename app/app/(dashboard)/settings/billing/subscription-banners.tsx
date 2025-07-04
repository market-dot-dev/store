import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, CircleArrowUp, CircleSlash, Sparkle } from "lucide-react";

export function UpgradeBanner() {
  return (
    <Alert variant="default">
      <CircleArrowUp className="size-4" />
      <AlertTitle>Upgrade to Pro</AlertTitle>
      <AlertDescription>Switch to Pro for commission-free sales.</AlertDescription>
    </Alert>
  );
}

export function CustomBanner() {
  return (
    <Alert variant="default">
      <Sparkle className="size-4" />
      <AlertTitle>You're on a custom plan</AlertTitle>
      <AlertDescription>To change or update your plan, please contact support.</AlertDescription>
    </Alert>
  );
}

export function ExpiredBanner() {
  return (
    <Alert variant="destructive">
      <CircleSlash className="size-4" />
      <AlertTitle>No active plan</AlertTitle>
      <AlertDescription>Select a plan to access all features.</AlertDescription>
    </Alert>
  );
}

export function ActiveBanner() {
  return (
    <Alert variant="success">
      <Check />
      <AlertTitle>Your plan is active</AlertTitle>
      <AlertDescription>
        Manage your subscription through the customer portal below.
      </AlertDescription>
    </Alert>
  );
}
