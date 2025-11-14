import Parse from "@/lib/parse/client";
import type { EventWithRelations } from "@/types/event";
import type { CategorySlug } from "@/types/category";
import { CATEGORIES } from "@/data/categories";

/**
 * Fetches events from the database with all relations included.
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

/**
 * Cache for category Parse objects - loaded once and reused
 */
let categoryCache: Map<CategorySlug, Parse.Object> | null = null;
let categoryCachePromise: Promise<Map<CategorySlug, Parse.Object>> | null = null;

/**
 * Load all categories from database once and cache them by slug
 */
async function loadCategoryCache(): Promise<Map<CategorySlug, Parse.Object>> {
    if (categoryCache) {
        return categoryCache;
    }

    if (categoryCachePromise) {
        return categoryCachePromise;
    }

    categoryCachePromise = (async () => {
        try {
            const query = new Parse.Query("Category");
            const categories = await query.find();

            const cache = new Map<CategorySlug, Parse.Object>();
            categories.forEach((cat) => {
                const slug = cat.get("slug") as CategorySlug;
                if (slug) {
                    cache.set(slug, cat);
                }
            });

            // Verify all predefined categories exist
            const missingCategories: CategorySlug[] = [];
            CATEGORIES.forEach((predefined) => {
                if (!cache.has(predefined.slug)) {
                    missingCategories.push(predefined.slug);
                }
            });

            if (missingCategories.length > 0) {
                console.warn(
                    `⚠️ Some predefined categories are missing from database: ${missingCategories.join(", ")}`
                );
            }

            categoryCache = cache;
            return cache;
        } catch (err: any) {
            console.error("Failed to load category cache:", err.message);
            throw err;
        } finally {
            categoryCachePromise = null;
        }
    })();

    return categoryCachePromise;
}

/**
 * Get category Parse object by slug from cache
 * Categories are loaded once and cached for performance
 */
export async function getCategoryBySlug(slug: CategorySlug): Promise<Parse.Object> {
    // Verify slug is valid
    const isValid = CATEGORIES.some((cat) => cat.slug === slug);
    if (!isValid) {
        throw new Error(`Invalid category slug: "${slug}"`);
    }

    const cache = await loadCategoryCache();
    const category = cache.get(slug);

    if (!category) {
        throw new Error(
            `Category with slug "${slug}" not found in database. Make sure categories are seeded.`
        );
    }

    return category;
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

    const category = await getCategoryBySlug(categorySlug);

    const Location = Parse.Object.extend("Location");
    const locationObj = new Location();
    locationObj.set("name", location.name);
    locationObj.set("address", location.address);
    locationObj.set("longitude", location.longitude);
    locationObj.set("latitude", location.latitude);

    // Set required fields on Event
    event.set("title", title);
    event.set("startDate", startDate);
    event.set("categoryId", category);
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