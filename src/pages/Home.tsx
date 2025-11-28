import { useCallback } from "react";
import useSWR from "swr";
import SearchJobs from "@/components/searchbar/SearchJobs";
import JobsSidebar from "@/components/JobsSidebar";
import { jobsToGeoJSON } from "@/lib/jobsToGeoJSON";
import Map from "@/components/map/Map";
import { getJobs, toggleJobFavorite } from "@/features/jobs/api";

export default function Home() {
  const { data: jobs, isLoading, error, mutate } = useSWR("jobs", getJobs);

  const handleToggleFavorite = useCallback(
    async (jobId: string) => {
      try {
        await toggleJobFavorite(jobId);
        mutate();
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    },
    [mutate]
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <>
      <SearchJobs />

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        <aside className="flex flex-col gap-4">
          <JobsSidebar jobs={jobs || []} onToggleFavorite={handleToggleFavorite} />
        </aside>

        <section>
          <div className="sticky top-14 h-[calc(100dvh-56px-16px-48px-16px)] py-6">
            <Map jobs={jobsToGeoJSON(jobs || [])} />
          </div>
        </section>
      </div>
    </>
  );
}
