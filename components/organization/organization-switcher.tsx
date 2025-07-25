"use client";

import { CreateOrganizationModal } from "@/app/app/(nonav)/organizations/create-organization-modal";
import { setCurrentOrganization } from "@/app/services/user-context-service";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { OrganizationForSwitcher, OrganizationSwitcherContext } from "@/types/organization";
import { ArrowLeftRight, ChevronsUpDown, SquarePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface OrganizationDisplayProps {
  organization: OrganizationForSwitcher;
  className?: string;
}

function OrganizationDisplay({ organization, className = "" }: OrganizationDisplayProps) {
  return (
    <div className={`flex items-center gap-2 overflow-auto ${className}`}>
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[3px] bg-swamp text-xs font-bold text-white`}
      >
        {organization.name ? getInitials(organization.name).charAt(0) : "?"}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold tracking-tightish text-foreground">
          {organization.name}
        </span>
      </div>
    </div>
  );
}

interface Props {
  context: OrganizationSwitcherContext;
}

export function OrganizationSwitcher({ context }: Props) {
  const { currentOrganization, availableOrganizations } = context;
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedOrgId, setSelectedOrgId] = useState(currentOrganization?.id || "");

  // Update selected org when current org changes
  useEffect(() => {
    setSelectedOrgId(currentOrganization?.id || "");
  }, [currentOrganization?.id]);

  const selectedOrg =
    availableOrganizations.find((org) => org.organization.id === selectedOrgId)?.organization ||
    currentOrganization;

  const handleOrganizationSwitch = async (orgId: string) => {
    if (orgId === selectedOrgId || !selectedOrg) return;

    setSelectedOrgId(orgId);

    startTransition(async () => {
      try {
        // Update the organization in the database
        await setCurrentOrganization(orgId);

        // Trigger session update to refresh JWT with new organization context
        await update();

        toast.success("Changed Organization");

        // Refresh the page to ensure all components get the updated context
        router.refresh();
      } catch (error) {
        console.error("Failed to switch organization:", error);
        // Revert the local state on error
        setSelectedOrgId(currentOrganization?.id || "");
      }
    });
  };

  if (!selectedOrg) {
    return null; // Or some fallback UI
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-[26px] w-full items-center gap-1 rounded bg-white px-1 text-left text-sm font-medium shadow-border-sm transition-[background-color,box-shadow] hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-swamp dark:hover:bg-stone-800"
        disabled={isPending}
      >
        <OrganizationDisplay organization={selectedOrg} />
        <ChevronsUpDown className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full min-w-[225px]">
        <div className="px-1 pb-1 pt-[3px]">
          <OrganizationDisplay organization={selectedOrg} />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2 p-1 font-medium">
            <ArrowLeftRight className="!h-4.5 !w-4.5 shrink-0" />
            Switch Organization
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="flex min-w-[200px] flex-col">
              {availableOrganizations.map(({ organization }) => (
                <DropdownMenuCheckboxItem
                  key={organization.id}
                  checked={selectedOrgId === organization.id}
                  onCheckedChange={() => handleOrganizationSwitch(organization.id)}
                  disabled={isPending}
                  className="h-[26px] pl-1 pr-9"
                >
                  <OrganizationDisplay organization={organization} className="flex-1" />
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem onClick={(e) => e.preventDefault()} asChild>
          <CreateOrganizationModal
            trigger={
              <Button variant="ghost" className="w-full justify-start gap-2 p-1">
                <SquarePlus className="!h-4.5 !w-4.5 shrink-0" />
                Create an Organization
              </Button>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
