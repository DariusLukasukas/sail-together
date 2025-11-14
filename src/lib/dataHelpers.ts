import type { Event, EventWithRelations } from "@/types/event";
import type { Job, JobWithRelations } from "@/types/job";
import { LOCATIONS } from "@/data/locations";
import { CATEGORIES } from "@/data/categories";
import { JOB_REQUIREMENTS, JOB_EXPERIENCE, JOB_QUALIFICATIONS } from "@/data/jobs";

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
  const category = CATEGORIES.find((cat) => cat.id === event.categoryId);

  // Provide fallback values if data is missing
  const fallbackLocation = {
    id: event.locationId || "unknown",
    name: "Location TBD",
    address: "Address TBD",
    longitude: 0,
    latitude: 0,
  };

  const fallbackCategory = {
    id: event.categoryId || "unknown",
    slug: "other" as const,
    name: "Other",
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
          id: category.id,
          slug: category.slug,
          name: category.name,
        }
      : fallbackCategory,
  };
}

/**
 * Helper to get job with relations (location, requirements, experience, qualifications)
 */
export function getJobWithRelations(job: Job): JobWithRelations {
  const location = LOCATIONS.find((loc) => loc.id === job.locationId);
  const requirements = JOB_REQUIREMENTS.filter((req) => req.jobId === job.id).sort((a, b) => a.order - b.order);
  const experience = JOB_EXPERIENCE.filter((exp) => exp.jobId === job.id).sort((a, b) => a.order - b.order);
  const qualifications = JOB_QUALIFICATIONS.filter((qual) => qual.jobId === job.id).sort((a, b) => a.order - b.order);

  if (!location) {
    throw new Error(`Missing location for job ${job.id}`);
  }

  return {
    ...job,
    location: {
      id: location.id,
      name: location.name,
      address: location.address,
      longitude: location.longitude,
      latitude: location.latitude,
    },
    requirements,
    experience,
    qualifications,
  };
}

