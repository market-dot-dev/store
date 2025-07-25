"use client";

import { Prospect } from "@/app/generated/prisma";
import Tier from "@/app/models/Tier";
import { ViewButton } from "@/components/ui/view-button";
import { formatDate } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Package } from "lucide-react";
import Link from "next/link";

// Define the shape of our data
export type ProspectWithTier = Prospect & { tier: Tier };

export const columns: ColumnDef<ProspectWithTier>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      emphasized: true
    },
    cell: ({ row }) => {
      const name = row.original.name;
      const email = row.original.email;

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-stone-800">{name}</span>
          {email && <span className="text-xs font-normal text-muted-foreground">{email}</span>}
        </div>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Reached Out",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    }
  },
  {
    accessorKey: "companyName",
    header: "Organization"
  },
  {
    accessorKey: "tier",
    header: "Interested In",
    cell: ({ row }) => {
      const tier = row.original.tier;
      if (!tier) {
        return <span>—</span>;
      }
      return (
        <Link
          href={`/tiers/${tier.id}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
        >
          <Package size={14} />
          {tier.name}
        </Link>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ViewButton href={`/prospects/${row.original.id}`} />
  }
];

export const renderProspectContextSubRowComponent = (row: Row<ProspectWithTier>) => {
  const { context } = row.original;
  if (!context) {
    return null;
  }
  return (
    <div className="ml-px px-5 pb-4">
      <p className="max-w-[calc(100vw-88px)] whitespace-pre-wrap border-l py-1 pl-2 text-xs font-medium italic tracking-tightish text-stone-500 sm:max-w-[calc(100vw-120px)] md:sm:max-w-[calc(100vw-120px-var(--sidebar-width))]">
        <span className="mr-0.5 font-serif">{"\u201C"}</span>
        {context}
        <span className="font-serif">{"\u201D"}</span>
      </p>
    </div>
  );
};
