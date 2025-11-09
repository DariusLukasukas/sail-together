import type { Event } from "@/types/event";
import SearchEvent from "@/components/searchbar/SearchEvent";
import Map from "@/components/map/Map";
import EventSidebar from "@/components/EventSidebar";
import { eventsToGeoJson } from "@/lib/eventsToGeoJSON";
import { useMemo, useState } from "react";
import { EVENTS } from "@/data/events";

export default function Events() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [events, _setEvents] = useState<Event[]>(EVENTS);

  const eventsGeoJSON = useMemo(() => eventsToGeoJson(events), [events]);

  return (
    <>
      <SearchEvent />
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        <aside className="flex flex-col gap-4">
          <EventSidebar events={events} />
        </aside>

        <section>
          <div className="sticky top-14 h-[calc(100dvh-56px-16px-48px-16px)] py-6">
            <Map events={eventsGeoJSON} />
          </div>
        </section>
      </div>
    </>
  );
}
