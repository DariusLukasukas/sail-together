import { useMemo, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import useSWR from "swr";
import SearchJobs, { type SearchFilters } from "@/components/searchbar/SearchJobs";
import JobsSidebar from "@/components/JobsSidebar";
import { getJobs, toggleJobFavorite } from "@/features/jobs/api";
import { jobsToGeoJSON } from "@/lib/jobsToGeoJSON";
import Map from "@/components/map/Map";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

export default function Home() {
  const { data, isLoading, error, mutate } = useSWR("jobs", getJobs, {
    dedupingInterval: 10 * 60 * 1000,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const [mapBounds, setMapBounds] = useState<{
    ne: [number, number];
    sw: [number, number];
  } | null>(null);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: null,
    position: null,
    availability: undefined,
  });

  const handleBoundsChange = useCallback(
    (bounds: { ne: [number, number]; sw: [number, number] }) => {
      setMapBounds(bounds);
    },
    []
  );

  const handleFiltersChange = useCallback((filters: SearchFilters) => {
    console.log("Search filters changed:", filters);
    setSearchFilters(filters);
  }, []);

  const filteredJobs = useMemo(() => {
    if (!data) return undefined;
    if (!mapBounds) return undefined;

    let filtered = data.filter((job) => {
      if (!job.location?.longitude || !job.location?.latitude) return false;

      const lng = job.location.longitude;
      const lat = job.location.latitude;

      const inBounds =
        lng >= mapBounds.sw[0] &&
        lng <= mapBounds.ne[0] &&
        lat >= mapBounds.sw[1] &&
        lat <= mapBounds.ne[1];

      if (!inBounds) return false;

      if (searchFilters.location) {
        const locationMatch =
          job.location.name?.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
          job.location.address?.toLowerCase().includes(searchFilters.location.toLowerCase());
        if (!locationMatch) return false;
      }

      if (searchFilters.position) {
        const positionMatch = job.title.toLowerCase() === searchFilters.position.toLowerCase();
        if (!positionMatch) return false;
      }

      if (searchFilters.availability?.from) {
        const jobDate = new Date(job.date);
        const searchFrom = startOfDay(searchFilters.availability.from);
        const searchTo = searchFilters.availability.to
          ? endOfDay(searchFilters.availability.to)
          : endOfDay(searchFilters.availability.from);

        const dateMatch = isWithinInterval(jobDate, { start: searchFrom, end: searchTo });
        if (!dateMatch) return false;
      }

      return true;
    });

    console.log(`Filtered ${filtered.length} jobs out of ${data.length}`);
    return filtered;
  }, [data, mapBounds, searchFilters]);

  const jobsGeoJSON = useMemo(() => {
    if (!filteredJobs) return undefined;
    return jobsToGeoJSON(filteredJobs);
  }, [filteredJobs]);

  const handleToggleFavorite = useCallback(
    async (jobId: string) => {
      mutate(
        (currentJobs) =>
          currentJobs?.map((job) =>
            job.id === jobId ? { ...job, isFavorite: !job.isFavorite } : job
          ),
        false
      );

      try {
        await toggleJobFavorite(jobId);
        mutate();
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
        mutate();
      }
    },
    [mutate]
  );

  return (
    <>
      <Outlet />

      <SearchJobs onFiltersChange={handleFiltersChange} />

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
        <aside className="flex flex-col gap-4">
          {isLoading && <div>Loading...</div>}

          {!isLoading && !error && !mapBounds && <div>Loading map...</div>}

          {filteredJobs && (
            <>
              <JobsSidebar jobs={filteredJobs} onToggleFavorite={handleToggleFavorite} />
            </>
          )}
        </aside>

        <section className="sticky top-4 h-[calc(100vh-5rem)] md:col-start-2">
          <Map jobs={jobsGeoJSON} onBoundsChange={handleBoundsChange} />
        </section>
      </div>
    </>
  );
}
