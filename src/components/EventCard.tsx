import { cn } from "@/lib/utils";
import type { EventWithRelations } from "@/types/event";
import { Media, MediaFallback } from "./ui/media";
import { format } from "date-fns";
import { Heart } from "lucide-react";

// TEMPORARY HERE
function formatEventDate(date: Date | string | undefined): string {
  if (!date) return "Date TBD";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    return `${format(dateObj, "hh:mm a")} ${format(dateObj, "do MMM yyyy")}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date TBD";
  }
}

export default function EventCard({
  event,
  className,
  ...props
}: React.ComponentProps<"div"> & { event: EventWithRelations }) {
  return (
    <div aria-label="event-card" className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <Media className="aspect-square w-full rounded-3xl">
        {event.isFavorite ? (
          <Heart
            name="heart"
            className="fill-heart-red text-heart-red absolute top-3 right-3 size-7"
          />
        ) : (
          <Heart
            name="heart-fill"
            className="absolute top-3 right-3 size-7 fill-neutral-500 text-neutral-500"
          />
        )}
        <MediaFallback className="bg-neutral-300" />
      </Media>

      <div className="flex w-full flex-col">
        <h3 className="font-semibold">{event.title || "Untitled Event"}</h3>

        <div className="text-muted-foreground flex gap-2 text-sm">
          <p>{formatEventDate(event.startDate)}</p>
        </div>
        <p className="text-muted-foreground text-sm">{event.location.name || "Location TBD"}</p>
      </div>
    </div>
  );
}
