import type { Event } from "@/types/event";
import SearchEvent from "@/components/SearchEvent";
import Map from "@/components/Map";
import EventSidebar from "./EventSidebar";
import { eventsToGeoJson } from "@/lib/eventsToGeoJSON";
import { useMemo, useState } from "react";

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Offshore Race",
    isFavorite: true,
    startDate: "2025-10-21T09:30:00+02:00",
    category: "race",
    price: { kind: "paid", amount: 100, currency: "DKK" },
    location: {
      name: "Amager Strandpark",
      address: "Amager Strandpark, 2300 København S",
      coordinates: {
        longitude: 12.61,
        latitude: 55.664,
      },
    },
  },
  {
    id: "2",
    title: "Marina Party",
    startDate: "2025-10-25T10:30:00+02:00",
    category: "party",
    price: { kind: "free" },
    location: {
      name: "Tuborg Harbor",
      address: "Tuborg Havnevej 7, 2900 Hellerup",
      coordinates: {
        longitude: 12.5685,
        latitude: 55.7288,
      },
    },
  },
  {
    id: "3",
    title: "Evening Sail",
    description: "Short sunset sail from Nyhavn Harbour",
    startDate: "2025-10-26T18:00:00+02:00",
    endDate: "2025-10-26T20:00:00+02:00",
    category: "meetup",
    price: { kind: "free" },
    location: {
      name: "Nyhavn Harbour",
      address: "Nyhavn, 1051 København K",
      coordinates: {
        longitude: 12.6524923,
        latitude: 55.6545888,
      },
    },
  },
];

export default function Events() {
  const [events, setEvents] = useState(EVENTS);
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
