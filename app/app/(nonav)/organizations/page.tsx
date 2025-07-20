import { getOrganizationSwitcherContext } from "@/app/services/user-context-service";
import Image from "next/image";
import Link from "next/link";
import { CreateOrganizationModal } from "./create-organization-modal";
import { OrganizationItem } from "./organization-item";

export default async function OrganizationsPage() {
  const { availableOrganizations: orgs } = await getOrganizationSwitcherContext();

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-10 md:p-12">
      <div className="mx-auto w-full max-w-md space-y-10 text-center md:max-w-lg md:space-y-12">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="flex justify-center">
            <Image
              src="/gw-logo-nav.png"
              alt="market.dev Logo"
              className="size-8 shrink-0 md:size-10"
              height={40}
              width={40}
              priority
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tightish text-foreground md:text-3xl">
            Your Organizations
          </h1>
        </div>

        <div className="relative">
          <div className="relative z-[1] rounded-lg bg-white shadow-border">
            {orgs.length === 0 ? (
              <div className="p-6 py-8">
                <p className="text-muted-foreground">You haven't joined any organizations yet.</p>
              </div>
            ) : (
              orgs.map(({ organization }) => (
                <div
                  key={organization.id}
                  className="border-b transition-all duration-200 first:rounded-t-lg last:rounded-b-lg last:border-0 hover:bg-stone-50"
                >
                  <OrganizationItem organization={organization} />
                </div>
              ))
            )}
          </div>
          <div className="z-0 -mt-5 flex flex-col gap-4 rounded-b-lg border bg-stone-150 pt-9">
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-t border-dashed border-stone-300" />
              <p className="flex-none text-center text-xs font-medium text-muted-foreground xs:whitespace-nowrap">
                Want to use market.dev for another project?
              </p>
              <hr className="flex-1 border-t border-dashed border-stone-300" />
            </div>
            <div className="px-4 pb-4 md:px-5 md:pb-5">
              <CreateOrganizationModal autoOpen={orgs.length === 0} />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/c" className="transition-colors hover:text-foreground">
              Go to Customer Portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
