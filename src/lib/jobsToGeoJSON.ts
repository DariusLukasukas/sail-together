import type { Job } from "@/types/job";
import type { GenericFeature, GenericFeatureCollection } from "@/types/map";

function jobToFeature(job: Job): GenericFeature {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [job.location.coordinates.longitude, job.location.coordinates.latitude],
    },
    properties: {
      id: job.id,
      title: job.title,
    },
  };
}

export function jobsToGeoJSON(jobs: Job[]): GenericFeatureCollection {
  return {
    type: "FeatureCollection",
    features: jobs.filter((j) => j.location?.coordinates).map((j) => jobToFeature(j)),
  };
}
