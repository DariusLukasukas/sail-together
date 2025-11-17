import Parse from "@/lib/parse/client";
import type { EventWithRelations } from "@/types/event";
import type { CategorySlug } from "@/types/category";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";

/**
 * Fetches events from the database with all relations included.
 */
export async function getEvents(limit = 20): Promise<EventWithRelations[]> {
  const query = new Parse.Query("Event");
  query.include("locationId");
  query.include("createdById");
  query.descending("createdAt");
  query.limit(limit);

  try {
    const results = await query.find();
    return results.map((e) => {
      const categorySlug = e.get("categorySlug") as CategorySlug;
      const location = e.get("locationId");
      const createdBy = e.get("createdById");

      // Get category from static data
      const categoryDef = getCategoryBySlug(categorySlug) || getCategoryBySlug("other")!;

      // Build the event with relations
      const event: EventWithRelations = {
        id: e.id,
        title: e.get("title"),
        description: e.get("description"),
        isFavorite: e.get("isFavorite") || false,
        startDate: e.get("startDate"),
        endDate: e.get("endDate"),
        priceKind: e.get("priceKind"),
        priceAmount: e.get("priceAmount"),
        priceCurrency: e.get("priceCurrency"),
        createdAt: e.get("createdAt"),
        updatedAt: e.get("updatedAt"),
        // Relations
        category: {
          slug: categoryDef.slug,
          name: categoryDef.name,
        },
        location: location
          ? {
              id: location.id,
              name: location.get("name"),
              address: location.get("address"),
              longitude: location.get("longitude"),
              latitude: location.get("latitude"),
            }
          : {
              id: "",
              name: "Location TBD",
              address: "Address TBD",
              longitude: 0,
              latitude: 0,
            },
        // Keep IDs for direct access
        categorySlug: categorySlug,
        locationId: location?.id || "",
        createdById: createdBy?.id,
        createdBy: createdBy
          ? {
              id: createdBy.id,
              name: createdBy.get("name") || createdBy.get("username") || "Unknown",
              avatarUrl: createdBy.get("avatarUrl"),
            }
          : undefined,
      };

      return event;
    });
  } catch (err: any) {
    console.error("Failed to fetch events:", err.message);
    throw err;
  }
}

export async function createEvent({
  title,
  description,
  startDate,
  endDate,
  categorySlug,
  location,
  priceKind,
  priceAmount,
  priceCurrency,
}: {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  categorySlug: CategorySlug;
  location: {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  priceKind: "free" | "paid";
  priceAmount?: number;
  priceCurrency?: "DKK" | "EUR" | "USD";
}): Promise<Parse.Object> {
  const Event = Parse.Object.extend("Event");
  const event = new Event();

  // Get current user
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("User must be logged in to create an event");
  }

  // Validate category slug
  const isValid = CATEGORIES.some((cat) => cat.slug === categorySlug);
  if (!isValid) {
    throw new Error(`Invalid category slug: "${categorySlug}"`);
  }

  const Location = Parse.Object.extend("Location");
  const locationObj = new Location();
  locationObj.set("name", location.name);
  locationObj.set("address", location.address);
  locationObj.set("longitude", location.longitude);
  locationObj.set("latitude", location.latitude);

  // Set required fields on Event
  event.set("title", title);
  event.set("startDate", startDate);
  event.set("categorySlug", categorySlug);
  event.set("locationId", locationObj); // Set the unsaved Location object as pointer
  event.set("priceKind", priceKind);
  event.set("createdById", currentUser);

  // Set optional fields
  if (description) event.set("description", description);
  if (endDate) event.set("endDate", endDate);
  if (priceKind === "paid" && priceAmount) {
    event.set("priceAmount", priceAmount);
    if (priceCurrency) event.set("priceCurrency", priceCurrency);
  }

  try {
    // Save Event - Parse will automatically save the Location first!
    const saved = await event.save();
    return saved;
  } catch (err: any) {
    console.error("Failed to create event:", err.message);
    throw err;
  }
}
