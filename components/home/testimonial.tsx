import Image from "next/image";
import type { ReactElement } from "react";
import Link from "./link";

interface TestimonialProps {
  quote: ReactElement<any> | string;
  quotee: {
    name: string;
    title: string;
    company: {
      name: string;
      url?: string;
    };
    image?: {
      src: string;
      alt?: string;
    };
  };
}

const CompanyName = ({ name, url }: { name: string; url?: string }) =>
  url ? (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      {name}
    </Link>
  ) : (
    name
  );

export default function Testimonial({ quote, quotee }: TestimonialProps) {
  return (
    <div className="mx-auto w-full max-w-[800px] px-6 lg:max-w-[var(--marketing-max-width)] lg:px-12">
      <div className="mb-12 mt-9 flex flex-col gap-4 text-pretty border-black/[15%] sm:mb-16 sm:mt-12 sm:gap-6 md:items-center md:text-center">
        <blockquote className="text-pretty text-marketing-lg md:max-w-[40ch] lg:text-marketing-2xl">
          {quote}
        </blockquote>
        <div className="flex w-fit items-center gap-3">
          {quotee.image && (
            <Image
              src={quotee.image.src}
              width={32}
              height={32}
              className="rounded-full"
              alt={quotee.image.alt || `${quotee.name}, ${quotee.title} at ${quotee.company.name}`}
            />
          )}
          <p>
            {`${quotee.name}, ${quotee.title} at `}
            <CompanyName {...quotee.company} />
          </p>
        </div>
      </div>
    </div>
  );
}
