export type Categories =
  | "race"
  | "cruise"
  | "meetup"
  | "training"
  | "maintenance"
  | "party"
  | "meeting"
  | "open-day"
  | "charity"
  | "other";

export type Currency = "DKK" | "EUR" | "USD" | string;

export type Price = { kind: "free" } | { kind: "paid"; amount: number; currency: Currency };

export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface Location {
  name: string;
  address: string;
  coordinates: Coordinates;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  isFavorite?: boolean;
  startDate: string;
  endDate?: string;
  category: Categories;
  price: Price;
  location: Location;
}
