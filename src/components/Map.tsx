import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import Marker from "./Marker";
import { type EventFeature, type EventFeatureCollection } from "@/lib/eventsToGeoJSON";

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface MapProps {
  events: EventFeatureCollection;
}

export default function Map({ events }: MapProps) {
  const mapRef = useRef<MapboxMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<EventFeature | null>(null);

  useEffect(() => {
    const token = MAPBOX_API_KEY;
    if (!token) {
      console.error("Mapbox API key is missing");
      return;
    }
    mapboxgl.accessToken = token;
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [12.5683, 55.6761],
      zoom: 10,
      attributionControl: false,
    });
    mapRef.current = map;

    mapRef.current.on("load", () => {
      console.log("Map loaded");
      setMapLoaded(true);
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!selectedMarker) return;
    mapRef.current!.flyTo({
      center: [selectedMarker.geometry.coordinates[0], selectedMarker.geometry.coordinates[1]],
      zoom: 12,
      duration: 1000,
    });
  }, [selectedMarker]);

  return (
    <div className="relative h-full w-full grow overflow-hidden rounded-2xl">
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />
      {mapLoaded &&
        events.features.map((location, i) => (
          <Marker
            key={`location-${i}`}
            feature={location}
            map={mapRef.current!}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          />
        ))}
    </div>
  );
}
