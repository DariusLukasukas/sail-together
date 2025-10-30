import type { Event } from "@/types/event";
import { Heart } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";

interface EventSidebarProps {
  events: Event[];
}

export default function EventSidebar({ events }: EventSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium">{events.length} events within map area</h2>
      {events.map((event) => (
        <div
          key={event.id}
          aria-label="Event card"
          className="flex w-full flex-row gap-2 rounded-none md:gap-4"
        >
          <div className="relative size-24 min-w-24 rounded-3xl bg-neutral-300">
            {event.isFavorite ? (
              <Heart
                name="heart"
                className="fill-heart-red text-heart-red absolute top-2.5 right-2.5 size-6"
              />
            ) : (
              <Heart
                name="heart-fill"
                className="absolute top-2.5 right-2.5 size-6 fill-neutral-500 text-neutral-500"
              />
            )}
          </div>

          <div className="flex w-full flex-col justify-between px-2 py-2 leading-none">
            <div className="font-semibold">{event.title}</div>
            <div className="flex flex-row gap-2 text-sm font-medium">
              <div>{format(parseISO(event.startDate), "hh:mm a")}</div>
              <div>{format(parseISO(event.startDate), "do MMM yyyy")}</div>
            </div>
            <div className="text-sm font-medium">{event.location?.name}</div>
          </div>

          <div className="flex items-start gap-2">
            <Button variant={"secondary"} size={"sm"}>
              Interested
            </Button>
            <Button size={"sm"}>Join</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
