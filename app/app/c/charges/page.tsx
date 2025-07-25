import { Charge } from "@/app/generated/prisma";
import { getChargesForCurrentUser } from "@/app/services/billing/connect-charge-service";
import { getTierByIdWithOrg } from "@/app/services/tier/tier-service";
import PageHeader from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const ChargeCard = async ({ charge }: { charge: Charge }) => {
  if (!charge || !charge.tierId) return null;

  const tier = await getTierByIdWithOrg(charge.tierId);
  if (!tier) return null;

  const status = "paid";

  return (
    <Card className="p-2">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center space-x-2">
            <strong>{tier.organization.name}</strong>
          </div>
        </div>

        <strong>Tier: {tier.name}</strong>

        <p className="text-sm text-stone-500">
          Status:&nbsp;
          {status}
        </p>
        <p className="text-sm text-stone-500">Description: {tier.tagline}</p>
        <p>
          ${tier.price} / {tier.cadence}
        </p>
        <p>{charge.tierVersionId}</p>
        <div className="flex flex-row space-x-2">
          <Link href={`/c/charges/${charge.id}`} className={buttonVariants({ variant: "default" })}>
            Tier Details
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default async function Charges() {
  const charges = await getChargesForCurrentUser();
  const anyCharges = charges.length > 0;

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10 p-6 sm:p-10">
      <PageHeader
        title="Your Purchases"
        description="All your one-time purchases from market.dev will appear here."
      />
      <div className="flex flex-col space-y-6">
        {charges.map((element) => (
          <ChargeCard charge={element} key={element.id} />
        ))}
        {!anyCharges && (
          <div className="flex flex-col space-y-2">
            <h2>No purchases</h2>
          </div>
        )}
      </div>
    </div>
  );
}
