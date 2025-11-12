import type { Event } from "@/types/event";

export const EVENTS: Event[] = [
  {
    id: "1",
    title: "Offshore Race",
    isFavorite: true,
    startDate: "2025-10-21T09:30:00+02:00",
    categoryId: "cat-1", // race
    locationId: "loc-1", // Kastrup Lystbådehavn
    priceKind: "paid",
    priceAmount: 100,
    priceCurrency: "DKK",
  },
  {
    id: "2",
    title: "Marina Party",
    startDate: "2025-10-25T10:30:00+02:00",
    categoryId: "cat-6", // party
    locationId: "loc-2", // Tuborg Harbor
    priceKind: "free",
  },
  {
    id: "3",
    title: "Evening Sail",
    description: "Short sunset sail from Nyhavn Harbour",
    startDate: "2025-10-26T18:00:00+02:00",
    endDate: "2025-10-26T20:00:00+02:00",
    categoryId: "cat-3", // meetup
    locationId: "loc-3", // Nyhavn Harbour
    priceKind: "free",
  },
];
