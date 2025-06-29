import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScanSearch, Users } from "lucide-react";
import Link from "next/link";

export const ProspectsEmptyState = () => (
  <Card className="mb-8 flex h-72 flex-col items-center justify-center border border-dashed border-stone-400/50 bg-stone-200/30 shadow-none">
    <div className="flex flex-col items-center justify-center py-6">
      <Users className="mb-3 size-9 text-swamp" strokeWidth={1.5} />
      <h3 className="mb-2 text-xl font-semibold">No Prospects... yet</h3>
      <p className="max-w-md text-center text-sm text-stone-500">
        When you get your first prospect
        <br /> they&apos;ll show up here.
      </p>
      <div className="mt-4">
        <Button variant="outline" asChild>
          <Link href="/research">
            <ScanSearch />
            Find prospects
          </Link>
        </Button>
      </div>
    </div>
  </Card>
);
