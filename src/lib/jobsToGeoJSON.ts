import type { JobWithRelations } from "@/features/jobs/api";
import type { GenericFeature, GenericFeatureCollection } from "@/types/map";

function jobToFeature(job: JobWithRelations): GenericFeature {
  if (!job.locationId?.longitude || !job.locationId?.latitude) {
    throw new Error(`Job ${job.id} missing valid location coordinates`);
  }

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [job.locationId.longitude, job.locationId.latitude],
    },
    properties: {
      id: job.id,
      title: job.title,
    },
  };
}

export function jobsToGeoJSON(jobs: JobWithRelations[]): GenericFeatureCollection {
  return {
    type: "FeatureCollection",
    features: jobs
      .filter((job) => job.locationId?.longitude && job.locationId?.latitude)
      .map((job) => {
        try {
          return jobToFeature(job);
        } catch (err) {
          console.warn(`Failed to convert job ${job.id} to GeoJSON feature:`, err);
          return null;
        }
      })
      .filter((feature): feature is GenericFeature => feature !== null),
  };
}
