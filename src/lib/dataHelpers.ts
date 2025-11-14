import type { Event, EventWithRelations } from "@/types/event";
import type { JobWithRelations } from "@/types/job";
import { LOCATIONS } from "@/data/locations";
import { CATEGORIES } from "@/data/categories";
import { getJobById } from "@/features/jobs/api";

/**
 * Helper to get event with relations (location, category)
 */
export function getEventWithRelations(event: Event): EventWithRelations {
  const location = LOCATIONS.find((loc) => loc.id === event.locationId);
  const category = CATEGORIES.find((cat) => cat.id === event.categoryId);

  if (!location || !category) {
    throw new Error(`Missing location or category for event ${event.id}`);
  }

  return {
    ...event,
    location: {
      id: location.id,
      name: location.name,
      address: location.address,
      longitude: location.longitude,
      latitude: location.latitude,
    },
    category: {
      id: category.id,
      slug: category.slug,
      name: category.name,
    },
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
