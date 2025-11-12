import type { Event, EventWithRelations } from "@/types/event";
import type { Job, JobWithRelations } from "@/types/job";
import { LOCATIONS } from "@/data/locations";
import { CATEGORIES } from "@/data/categories";
import { JOB_REQUIREMENTS, JOB_EXPERIENCE, JOB_QUALIFICATIONS } from "@/data/jobs";

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

