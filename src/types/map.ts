import type { Feature, FeatureCollection, Point } from "geojson";

export type CommonMapProperties = {
  id: string;
  title: string;
  category?: string;
};

export type GenericFeature = Feature<Point, CommonMapProperties>;
export type GenericFeatureCollection = FeatureCollection<Point, CommonMapProperties>;
