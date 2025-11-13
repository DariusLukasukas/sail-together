import type { Event } from "@/types/event";
import { Heart } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useEventStore } from "@/store/useEventStore";
import { Media, MediaFallback } from "./ui/media";

interface EventSidebarProps {
  events: Event[];
}

export default function EventSidebar({ events }: EventSidebarProps) {
  const { setHoveredEventId } = useEventStore();

  return (
    <>
      <h2 className="font-medium">{events.length} events within map area</h2>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            aria-label="Event card"
            onMouseEnter={() => setHoveredEventId(event.id)}
            onMouseLeave={() => setHoveredEventId(null)}
            className="flex w-full flex-col gap-2"
          >
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
              <h3 className="font-semibold">{event.title}</h3>

              <div className="text-muted-foreground flex gap-2 text-sm">
                <p>
                  {format(parseISO(event.startDate), "hh:mm a")}{" "}
                  {format(parseISO(event.startDate), "do MMM yyyy")}
                </p>
              </div>
              <p className="text-muted-foreground text-sm">{event.location?.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
