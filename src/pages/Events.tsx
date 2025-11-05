import type { Event } from "@/types/event";
import SearchEvent from "@/components/searchbar/SearchEvent";
import Map from "@/components/map/Map";
import EventSidebar from "@/components/EventSidebar";
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
      name: "Kastrup Lystbådehavn",
      address: "Amager Strand Promenaden 1, 2300 København S",
      coordinates: {
        longitude: 12.6504772,
        latitude: 55.6414876,
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
      address: "Tuborg Havnevej 15, 2900 Hellerup",
      coordinates: {
        longitude: 12.587332,
        latitude: 55.7267138,
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
        longitude: 12.5908,
        latitude: 55.6799,
      },
    },
  },
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>(EVENTS);

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
