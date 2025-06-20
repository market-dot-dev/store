import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded border-none bg-white px-3 py-2 text-base shadow-border-sm transition-[box-shadow,text-color] placeholder:text-foreground/50 hover:shadow-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-swamp disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
