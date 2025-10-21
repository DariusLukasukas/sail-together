import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { format, parseISO } from "date-fns";

type Currency = "DKK" | "EUR" | "USD" | string;
type Category = "race" | "party" | "meetup" | "training" | "cruise" | "other";
type Price = { kind: "free" } | { kind: "paid"; amount: number; currency: Currency };
type Coordinates = { longitude: number; latitude: number };

interface Location {
  name?: string;
  address?: string;
  coordinates?: Coordinates;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  isFavorite?: boolean;
  startDate: string;
  endDate?: string;
  category: Category;
  price: Price;
  location?: Location;
}

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Offshore Race",
    isFavorite: true,
    startDate: "2025-10-21T09:30:00+02:00",
    category: "race",
    price: { kind: "paid", amount: 100, currency: "DKK" },
    location: {
      name: "Amager Strand",
      address: "Amager Strand 1",
      coordinates: {
        longitude: 12.5725,
        latitude: 55.6755,
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
      name: "Amager Strand",
      address: "Amager Strand 1",
      coordinates: {
        longitude: 12.5725,
        latitude: 55.6755,
      },
    },
  },
  {
    id: "3",
    title: "Evening Sail",
    description: "Short sunset sail from Amager Strand",
    startDate: "2025-10-26T18:00:00+02:00",
    endDate: "2025-10-21T20:00:00+02:00",
    category: "meetup",
    price: { kind: "free" },
    location: {
      name: "Amager Strand",
      address: "Amager Strand 1",
      coordinates: {
        longitude: 12.5725,
        latitude: 55.6755,
      },
    },
  },
];

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-label="event-card" className={className}>
      {children}
    </div>
  );
}

export default function Events() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/*List of events*/}
      <div className="flex flex-col gap-4">
        <h2 className="font-medium">{EVENTS.length} events within map area</h2>

        {EVENTS.map((event) => (
          <Card key={event.id} className="flex w-full flex-row gap-4 rounded-none">
            {/*Image*/}
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
              <div className="flex flex-row gap-2">
                <div>{format(parseISO(event.startDate), "hh:mm a")}</div>
                <div>{format(parseISO(event.startDate), "do MMM yyyy")}</div>
              </div>
              <div>{event.location?.name}</div>
            </div>

            <div className="flex items-start gap-2">
              <Button variant={"secondary"} size={"sm"}>
                Interested
              </Button>
              <Button size={"sm"}>Join</Button>
            </div>
          </Card>
        ))}
      </div>

      {/*Map*/}
      <div>
        <div className="h-full min-h-40 w-full rounded-3xl bg-neutral-200" />
      </div>
    </div>
  );
}
