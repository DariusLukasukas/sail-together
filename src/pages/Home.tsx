import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FilterBar } from "@/components/FilterBar";
import { CalendarDays, Heart, Clock, Ship, MapPin } from "lucide-react";

const DATA = [
  {
    id: 1,
    favorite: false,
    title: "Engineer",
    type: "Permanent",
    date: "1th Sep 2025",
    vessel: "38m (125ft) Motor Yacht",
    location: "U.S Virgin Islands",
    inMapArea: true,
  },
  {
    id: 2,
    favorite: false,
    title: "Steward(ess)",
    type: "Permanent",
    date: "17th Sep 2025",
    vessel: "52m (171ft) Motor Yacht",
    location: "U.S Virgin Islands",
    inMapArea: true,
  },
  {
    id: 3,
    favorite: false,
    title: "Captain",
    type: "Permanent",
    date: "1th Oct 2025",
    vessel: "60m (197ft) Motor Yacht",
    location: "Bahamas",
    inMapArea: false,
  },
  {
    id: 4,
    favorite: false,
    title: "Chef",
    type: "Permanent",
    date: "15th Oct 2025",
    vessel: "45m (148ft) Motor Yacht",
    location: "Caribbean",
    inMapArea: true,
  },
  {
    id: 5,
    favorite: false,
    title: "Deckhand",
    type: "Permanent",
    date: "20th Nov 2025",
    vessel: "30m (98ft) Motor Yacht",
    location: "Mediterranean",
    inMapArea: false,
  },
];

export default function Home() {
  const location = useLocation();
  const [jobs, setJobs] = useState(DATA);
  const [activeTab, setActiveTab] = useState<string>("Jobs in map area");

  useEffect(() => {
    const navigationState = location.state as { activeTab?: string } | null;
    if (navigationState?.activeTab) {
      setActiveTab(navigationState.activeTab);
    }
  }, [location.state]);

  const toggleFavorite = (id: number) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === id ? { ...job, favorite: !job.favorite } : job))
    );
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "Jobs in map area") {
      return job.inMapArea;
    }
    if (activeTab === "All positions") {
      return true;
    }
    if (activeTab === "Availability") {
      return true;
    }
    return true;
  });

  const jobCount = filteredJobs.length;
  const displayText =
    activeTab === "Jobs in map area"
      ? `${jobCount} Jobs within map area`
      : `${jobCount} Total positions`;

  return (
    <div>
      <div>
        <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div>{displayText}</div>

          {/* JOBS LIST */}
          <ul className="flex flex-col gap-2.5" role="list">
            {filteredJobs.map((job) => (
              <li key={job.id} role="listitem">
                <Link
                  to={`/jobs/${job.id}`}
                  state={{ job }}
                  aria-label={`View details for ${job.title}`}
                  className="flex flex-row gap-2.5"
                >
                  <div className="relative size-24 rounded-3xl bg-neutral-300">
                    <button
                      aria-label={job.favorite ? "Remove from favorites" : "Add to favorites"}
                      aria-pressed={job.favorite}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(job.id);
                      }}
                    >
                      <Heart
                        className={`absolute top-2.5 right-2.5 cursor-pointer transition ${
                          job.favorite
                            ? "fill-red-500 text-red-500"
                            : "fill-neutral-400 text-neutral-400"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex flex-col justify-between py-2">
                    <h2 className="font-semibold">{job.title}</h2>
                    <div className="flex items-center gap-x-4">
                      <p className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-neutral-400" /> <span>{job.type}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{job.date}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-x-4">
                      <p className="flex items-center gap-1">
                        <Ship className="h-3.5 w-3.5 text-neutral-400" /> <span>{job.vessel}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{job.location}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* MAP */}
        <div>
          <div className="h-screen w-full rounded-4xl bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
