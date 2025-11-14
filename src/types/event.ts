import type { CategorySlug } from "./category";

export type Currency = "DKK" | "EUR" | "USD";

/**
 * Normalized Event table for PostgreSQL
 * - Uses locationId foreign key instead of nested Location
 * - Uses categorySlug string instead of category table reference
 * - Flattens price structure for database storage
 * - Uses createdById to track event creator
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  isFavorite?: boolean;
  startDate: Date | string;
  endDate?: Date | string;
  categorySlug: CategorySlug; // Static category slug (no database table)
  locationId: string; // Foreign key to Location table
  createdById?: string; // Foreign key to User table (optional)

  // Price fields (flattened from nested object)
  priceKind: "free" | "paid";
  priceAmount?: number; // Only set when priceKind === "paid"
  priceCurrency?: Currency; // Only set when priceKind === "paid"

  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Event with joined relations (for API responses)
 * Use this when you need the full location/category objects
 * Category is derived from static data using categorySlug
 */
export interface EventWithRelations extends Omit<Event, "locationId" | "createdById"> {
  category: {
    slug: CategorySlug;
    name: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  createdBy?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  // Keeping IDs for backward compatibility and direct access
  locationId: string;
  createdById?: string;
}
