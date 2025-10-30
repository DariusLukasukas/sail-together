import mapboxgl from "mapbox-gl";
import type { EventFeature } from "@/lib/eventsToGeoJSON";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface MarkerProps {
  map: mapboxgl.Map;
  feature: EventFeature;
  selectedMarker: EventFeature | null;
  setSelectedMarker: (marker: EventFeature | null) => void;
}

export default function Marker({ map, feature, selectedMarker, setSelectedMarker }: MarkerProps) {
  const { geometry } = feature;

  const contentRef = useRef<HTMLDivElement>(document.createElement("div"));
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const isSelected = feature.properties.title === selectedMarker?.properties.title;

  useEffect(() => {
    if (!map) return;

    const marker = new mapboxgl.Marker(contentRef.current)
      .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      markerRef.current?.remove();
    };
  }, [map, geometry.coordinates]);

  console.log("marker render");

  return (
    <>
      {createPortal(
        <div
          onClick={() => setSelectedMarker(feature)}
          className={`size-5 rounded-full bg-blue-500 ${isSelected ? "bg-red-500" : ""}`}
        />,
        contentRef.current
      )}
    </>
  );
}
