import type { Event } from "@/types/event";
import SearchEvent from "@/components/searchbar/SearchEvent";
// import Map from "@/components/map/Map";
import EventSidebar from "@/components/EventSidebar";
// import { eventsToGeoJson } from "@/lib/eventsToGeoJSON";
import { useState } from "react";
import { EVENTS } from "@/data/events";
import AddEventForm from "@/components/forms/AddEventForm";

export default function Events() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [events, _setEvents] = useState<Event[]>(EVENTS);

  // const eventsGeoJSON = useMemo(() => eventsToGeoJson(events), [events]);

  return (
    <>
      <SearchEvent />
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        <aside className="flex flex-col gap-4">
          <EventSidebar events={events} />
        </aside>

        <section>
          <div className="sticky top-14 h-[calc(100dvh-56px-16px-48px-16px)] py-6">
            {/* <Map events={eventsGeoJSON} /> */}

            {/* TEMPORARY DEV PANEL */}
            <div className="rounded-xl border-3 border-orange-500 p-4">
              <p className="text-xl font-bold text-orange-500 uppercase">Dev Panel</p>
              <AddEventForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
