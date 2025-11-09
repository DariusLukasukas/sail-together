import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import type { GenericFeatureCollection } from "@/types/map";

const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;

interface BaseMapPros {
  data: GenericFeatureCollection;
}

export default function BaseMap({ data }: BaseMapPros) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

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
      center: [data.features[0].geometry.coordinates[0], data.features[0].geometry.coordinates[1]],
      zoom: 8,
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
  }, [data]);

  return (
    <div className="relative size-full overflow-hidden rounded-3xl">
      {!mapLoaded && (
        <div className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center">
          <span className="animate-pulse">Sorry, map loading failed</span>
        </div>
      )}
      <div ref={mapContainerRef} className="absolute inset-0 size-full" />
    </div>
  );
}
