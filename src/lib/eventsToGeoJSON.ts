import type { Feature, FeatureCollection, Point } from "geojson";
import type { Categories, Event } from "@/types/event";

export type EventFeatureProperties = {
  id: string;
  title: string;
  category: Categories;
};

export type EventFeature = Feature<Point, EventFeatureProperties>;
export type EventFeatureCollection = FeatureCollection<Point, EventFeatureProperties>;

function eventToFeature(event: Event): EventFeature {
  const { longitude, latitude } = event.location.coordinates;
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    properties: {
      id: event.id,
      title: event.title,
      category: event.category,
    },
  };
}

export function eventsToGeoJson(events: Event[]): EventFeatureCollection {
  return {
    type: "FeatureCollection",
    features: events
      .filter((event) => event.location?.coordinates)
      .map((event) => eventToFeature(event)),
  };
}
