import { useState } from "react";
import SearchJobs from "@/components/searchbar/SearchJobs";
import JobsSidebar from "@/components/JobsSidebar";
import { JOBS } from "@/data/jobs";
import type { Job } from "@/types/job";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jobs, _setJobs] = useState<Job[]>(JOBS);

  return (
    <>
      <SearchJobs />

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        <aside className="flex flex-col gap-4">
          <JobsSidebar jobs={jobs} />
        </aside>
      </div>
    </>
  );
}
