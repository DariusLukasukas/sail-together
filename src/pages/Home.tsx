import { useMemo, useState } from "react";
import SearchJobs from "@/components/searchbar/SearchJobs";
import JobsSidebar from "@/components/JobsSidebar";
import { JOBS } from "@/data/jobs";
import type { Job } from "@/types/job";
import { jobsToGeoJSON } from "@/lib/jobsToGeoJSON";
import Map from "@/components/map/Map";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jobs, _setJobs] = useState<Job[]>(JOBS);
  const jobsGeoJSON = useMemo(() => jobsToGeoJSON(jobs), [jobs]);

  return (
    <>
      <SearchJobs />

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        <aside className="flex flex-col gap-4">
          <JobsSidebar jobs={jobs} />
        </aside>

        <section>
          <div className="sticky top-14 h-[calc(100dvh-56px-16px-48px-16px)] py-6">
            <Map jobs={jobsGeoJSON} />
          </div>
        </section>
      </div>
    </>
  );
}
