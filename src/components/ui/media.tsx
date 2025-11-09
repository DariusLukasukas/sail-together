import * as React from "react";
import { cn } from "@/lib/utils";

function Media({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="media"
      className={cn("relative flex shrink-0 overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function MediaImage({ className, ...props }: React.ComponentProps<"img">) {
  return (
    <img data-slot="media-image" className={cn("size-full object-cover", className)} {...props} />
  );
}

function MediaFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="media-fallback"
      className={cn("bg-muted flex size-full items-center justify-center", className)}
      {...props}
    />
  );
}

export { Media, MediaImage, MediaFallback };
