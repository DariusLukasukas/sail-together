import Parse from "@/lib/parse/client";
import type { EventWithRelations } from "@/types/event";
import type { CategorySlug } from "@/types/category";

/**
 * Fetches events from the database with all relations included.
 * Returns EventWithRelations which includes full category, location, and createdBy objects.
 */
export async function getEvents(limit = 20): Promise<EventWithRelations[]> {
    const query = new Parse.Query("Event");
    query.include("categoryId");
    query.include("locationId");
    query.include("createdById");
    query.descending("createdAt");
    query.limit(limit);

    try {
        const results = await query.find();
        return results.map((e) => {
            const category = e.get("categoryId");
            const location = e.get("locationId");
            const createdBy = e.get("createdById");

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
                category: category
                    ? {
                        id: category.id,
                        slug: category.get("slug") as CategorySlug,
                        name: category.get("name"),
                    }
                    : {
                        id: "",
                        slug: "other" as CategorySlug,
                        name: "Other",
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
                categoryId: category?.id || "",
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

export async function getCategoryBySlug(slug: CategorySlug) {
    const query = new Parse.Query("Category");
    query.equalTo("slug", slug);
    try {
        const result = await query.first();
        if (!result) {
            throw new Error(`Category with slug "${slug}" not found`);
        }
        return result;
    } catch (err: any) {
        console.error("Failed to fetch category:", err.message);
        throw err;
    }
}

export async function createLocation({
    name,
    address,
    longitude,
    latitude,
}: {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
}): Promise<Parse.Object> {
    const Location = Parse.Object.extend("Location");
    const location = new Location();
    location.set("name", name);
    location.set("address", address);
    location.set("longitude", longitude);
    location.set("latitude", latitude);

    try {
        const saved = await location.save();
        return saved;
    } catch (err: any) {
        console.error("Failed to create location:", err.message);
        throw err;
    }
}

export async function createEvent({
    title,
    description,
    startDate,
    endDate,
    categorySlug,
    locationId,
    priceKind,
    priceAmount,
    priceCurrency,
}: {
    title: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    categorySlug: CategorySlug;
    locationId: string;
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

    // Get category
    const category = await getCategoryBySlug(categorySlug);

    // Set required fields
    event.set("title", title);
    event.set("startDate", startDate);
    event.set("categoryId", category);

    // Create a pointer to the location
    const locationPointer = Parse.Object.extend("Location");
    const locationObj = new locationPointer();
    locationObj.id = locationId;
    event.set("locationId", locationObj);

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
        const saved = await event.save();
        return saved;
    } catch (err: any) {
        console.error("Failed to create event:", err.message);
        throw err;
    }
}
