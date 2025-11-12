import type { Job, JobWithRelations } from "@/types/job";
import type { GenericFeature, GenericFeatureCollection } from "@/types/map";
import { getJobWithRelations } from "./dataHelpers";

function jobToFeature(job: JobWithRelations): GenericFeature {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [job.location.longitude, job.location.latitude],
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
    features: jobs
      .map((job) => {
        try {
          return getJobWithRelations(job);
        } catch {
          return null;
        }
      })
      .filter((job): job is JobWithRelations => job !== null)
      .filter((j) => j.location?.longitude && j.location?.latitude)
      .map((j) => jobToFeature(j)),
  };
}
