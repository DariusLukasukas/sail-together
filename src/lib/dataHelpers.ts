import type { Event, EventWithRelations } from "@/types/event";
import type { Job, JobWithRelations } from "@/types/job";
import type { CategorySlug } from "@/types/category";
import { LOCATIONS } from "@/data/locations";
import { CATEGORIES } from "@/data/categories";
import { getJobById } from "@/features/jobs/api";

/**
 * Helper to get event with relations (location, category)
 * Works with both static data and database events
 */
export function getEventWithRelations(event: Event & { _category?: any; _location?: any }): EventWithRelations {
  // If event has embedded relations from API (prefixed with _)
  if (event._location && event._category) {
    return {
      ...event,
      location: event._location,
      category: event._category,
      createdBy: (event as any)._createdBy,
    };
  }

  // Fallback to static data lookup
  const location = LOCATIONS.find((loc) => loc.id === event.locationId);
  const category = CATEGORIES.find((cat) => cat.slug === event.categorySlug);

  // Provide fallback values if data is missing
  const fallbackLocation = {
    id: event.locationId || "unknown",
    name: "Location TBD",
    address: "Address TBD",
    longitude: 0,
    latitude: 0,
  };

  const fallbackCategory = {
    slug: (event.categorySlug || "other") as CategorySlug,
    name: category?.name || "Other",
  };

  return {
    ...event,
    location: location
      ? {
        id: location.id,
        name: location.name,
        address: location.address,
        longitude: location.longitude,
        latitude: location.latitude,
      }
      : fallbackLocation,
    category: category
      ? {
        slug: category.slug,
        name: category.name,
      }
      : fallbackCategory,
  };
}

/**
 * Helper to get job with relations (location, requirements, experience, qualifications)
 */
export async function getJobWithRelations(
  job: JobWithRelations
): Promise<JobWithRelations> {
  if (
    job.location?.id &&
    typeof job.location.longitude === "number" &&
    typeof job.location.latitude === "number"
  ) {
    return job;
  }

  if (!job.id) {
    throw new Error("getJobWithRelations: job has no id");
  }

  const full = await getJobById(job.id);
  if (!full) {
    throw new Error(`Job ${job.id} not found`);
  }

  return full;
}
