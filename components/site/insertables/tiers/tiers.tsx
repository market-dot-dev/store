import TierCard from "@/components/tiers/tier-card";
import SkeletonTiers from "../../skeleton-tiers";

// This renders the actual component for both server and client sides.
export default function Tiers({ tiers }: { tiers: any[] }) {
  return (
    <div className="mx-auto flex justify-center">
      {tiers.length ? (
        <div className="mx-auto flex max-w-screen-2xl flex-wrap justify-center gap-6">
          {tiers.map((tier, index) => (
            <div key={index} className="min-w-xxs w-full md:max-w-xs">
              <TierCard tier={tier} alignment={tiers.length === 1 ? "center" : "left"} />
            </div>
          ))}
        </div>
      ) : (
        <SkeletonTiers />
      )}
    </div>
  );
}
