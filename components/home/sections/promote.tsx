"use client";

import FeatureCard from "@/components/home/feature-card";
import Section from "@/components/home/section";
import { colors } from "@/lib/home/colors";
import { cn } from "@/lib/utils";
import { CodeSquare, ShoppingCart, Speech, StoreIcon } from "lucide-react";
import React, { useState } from "react";

const featureCards = [
  {
    icon: <StoreIcon />,
    title: "Custom landing pages",
    description:
      "Sell with your own standalone store. Start with a beautiful template or pop the hood with a full-screen code editor.",
    image: {
      src: "/landing-page.png",
      alt: "Package cards illustration"
    }
  },
  {
    icon: <ShoppingCart />,
    title: "Checkout links",
    description:
      "Share payment links to let people buy with one click. Great for selling through social media & emails.",
    image: {
      src: "/checkout.png",
      alt: "Package cards illustration"
    }
  },
  {
    icon: <CodeSquare />,
    title: "Purpose-built embeds",
    description:
      "Use single-purpose, customizable embeds to promote services on your repo, read.me, or anywhere really.",
    image: {
      src: "/embeds.png",
      alt: "Package cards illustration"
    }
  }
];

export default function Promote() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Section
      id="promote"
      badge={{
        icon: <Speech />,
        title: "Promote"
      }}
      color={colors.purple["100"]}
      headline={
        <>
          Market Eve<span className="tracking-normal">ry</span>where
        </>
      }
      description="It doesn't have to be hard. Promote on your landing pages, in repos & across marketplaces — all from a single source of truth."
      isFullBleed
    >
      <div className="relative grid w-full grid-cols-1 flex-col gap-6 lg:hidden">
        {featureCards.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            image={feature.image}
            color={colors.purple}
            orientation="vertical"
            imageMaxWidth={null}
            className={cn(
              "sm:aspect-[4/3]",
              index === 0 && "col-span-full max-h-[500px] lg:aspect-[3/2]"
            )}
          />
        ))}
      </div>

      <div className="mx-auto hidden w-full max-w-[var(--marketing-max-width)] rounded-lg lg:grid lg:grid-cols-[290px_1fr]">
        <div className="-mr-4 flex flex-col overflow-hidden rounded-l-lg border border-r-0 border-black/10 bg-black/[2%]">
          {featureCards.map((feature, index) => (
            <React.Fragment key={feature.title}>
              <button
                onClick={() => setActiveTab(index)}
                className={cn(
                  "border-b-none group h-1/3 w-full px-9 py-6 text-left transition-colors hover:bg-[#fafafa]",
                  activeTab === index ? "bg-[#fafafa]" : "bg-transparent"
                )}
              >
                <div className="flex flex-col justify-center gap-3">
                  <div
                    className={cn(
                      "text-marketing-secondary",
                      "group-hover:text-marketing-purple group-focus:text-marketing-purple",
                      activeTab === index && "text-marketing-purple"
                    )}
                  >
                    {feature.icon}
                  </div>
                  <div
                    className={cn(
                      "text-marketing-secondary",
                      "group-hover:text-marketing-purple group-focus:text-marketing-purple",
                      activeTab === index && "text-marketing-purple"
                    )}
                  >
                    {feature.title}
                  </div>
                </div>
              </button>
              <hr className="border-t border-black/10 last:hidden" />
            </React.Fragment>
          ))}
        </div>

        <div className="size-full min-h-[530px] xl:min-h-[550px]">
          <FeatureCard
            icon={featureCards[activeTab].icon}
            title={featureCards[activeTab].title}
            description={featureCards[activeTab].description}
            image={featureCards[activeTab].image}
            color={colors.purple}
            orientation="vertical"
            imageMaxWidth="max-w-[750px]"
            className="h-full ring-0"
          />
        </div>
      </div>
    </Section>
  );
}
