import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Heart, Clock, Ship, MapPin } from "lucide-react";
import type { Job } from "@/types/job";
import SearchJobs from "@/components/searchbar/SearchJobs";

const JOBS: Job[] = [
  {
    id: 1,
    favorite: false,
    title: "Engineer",
    type: "Permanent",
    date: "1th Dec 2025",
    vessel: "38m (125ft) Motor Yacht",
    location: "Caribbean",
    inMapArea: true,
    jobDescription:
      "We are looking for an engineer to join a 38m M/Y. Vessel will be crossing from Caribbean to Mediterranean for season early December. Joining a team of 2 rotational chief engineers and a permanent 2nd engineer. The role will require work on deck during guest trips and mooring operation. This works out to be approx. 80/20 Engine Room/Deck. Responsible for maintaining and repairing the yacht's mechanical and electrical systems.",
    requirements: [
      "Proven experience as a marine engineer.",
      "Knowledge of mechanical and electrical systems.",
      "Ability to troubleshoot and repair equipment.",
    ],
    experience: "Minimum 3 years of experience as a marine engineer.",
    qualifications: [
      "STCW 95 (STCW 2010)",
      "ENG1 (Medical Certificate)",
      "MCA Approved Engine Course (AEC 1 & 2) Certificate",
      "GMDSS Certification",
      "Relevant maritime visas.",
    ],
  },
  {
    id: 2,
    favorite: false,
    title: "Chief Steward(ess)",
    type: "Permanent",
    date: "15th Nov 2025",
    vessel: "52m (171ft) Motor Yacht",
    location: "U.S Virgin Islands",
    inMapArea: true,
    jobDescription:
      "Great opportunity for a chief stewardess on a newbuild 52m private motor yacht. Candidate must be professional, well organised and demonstrate good leadership skills. The candidate will be expected to manage all areas of the interior department and liaise with the owners private chef when required. During the 3 month trial period candidate will work 2-4 weeks at owners winter villa to join his permanent team to give the candidate the opportunity get to know the owner and his family and vice versa.",
    requirements: [
      "Responsible for providing excellent service to guests and maintaining the interior of the yacht.",
      "Previous experience in a similar role.",
      "Excellent communication and interpersonal skills.",
      "Ability to multitask and work under pressure.",
    ],
    experience: "Minimum 2 years in similar role.",
    qualifications: [
      "STCW 95 (STCW 2010)",
      "ENG1 (Medical Certificate)",
      "Food and Hygiene Level 2",
    ],
  },
  {
    id: 3,
    favorite: false,
    title: "Captain",
    type: "Permanent",
    date: "1th Dec 2025",
    vessel: "60m (197ft) Motor Yacht",
    location: "Bahamas",
    inMapArea: false,
    jobDescription:
      "We are seeking an experienced Captain to oversee the operation and navigation of a 60-meter motor yacht. The ideal candidate will have a strong background in maritime operations, excellent leadership skills, and a commitment to safety and customer service.",
    requirements: [
      "Valid captain's license and certifications.",
      "Extensive experience in yacht navigation and operations.",
      "Strong leadership and team management skills.",
      "Excellent communication and interpersonal skills.",
    ],
    experience: "Minimum 5 years of experience as a yacht captain.",
    qualifications: [
      "STCW 95 (STCW 2010)",
      "ENG1 (Medical Certificate)",
      "MCA CoC Master <500gt / Class 5",
      "GMDSS Certification",
      "Valid captain's license",
      "Relevant maritime visas.",
    ],
  },
  {
    id: 4,
    favorite: false,
    title: "Chef",
    type: "Permanent",
    date: "15th Nov 2025",
    vessel: "45m (148ft) Motor Yacht",
    location: "Caribbean",
    inMapArea: true,
    jobDescription:
      "We are looking for a talented and experienced chef to join a 45m motor yacht. The ideal candidate will have a passion for culinary arts, experience in high-end dining, and the ability to cater to diverse dietary needs while at sea. The owners are very health-conscious and follow a specific dietary routine, often requesting certain products, ingredients, or cooking styles. The Chef must be flexible, creative, and willing to adapt to their preferences while maintaining the highest standards of presentation and nutrition. Excellent knowledge of gluten-free (GF) options, balanced menus, and fresh, seasonal cuisine is essential. You should be comfortable catering for daily family-style meals, light healthy lunches, and refined dinner service when required.",
    requirements: [
      "Proven experience as a yacht chef or in a similar role.",
      "Ability to create diverse and high-quality menus.",
      "Knowledge of food safety and hygiene standards.",
      "Excellent organizational and time-management skills.",
    ],
    experience: "Minimum 3 years of experience as a yacht chef.",
    qualifications: [
      "STCW 95 (STCW 2010)",
      "ENG1 (Medical Certificate)",
      "Food and Hygiene Level 2",
      "Must hold B1/B2 and Schengen visas",
    ],
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
    jobDescription:
      "We seek an experienced Deck-engineer to work on a 30 meter yacht. Responsible for maintaining the exterior of the yacht and assisting with docking and undocking procedures.",
    requirements: [
      "Previous experience as a deckhand.",
      "Knowledge of boat maintenance and cleaning.",
      "Ability to work in a team and follow instructions.",
    ],
    experience: "Minimum 1-2 year experience as a deckhand.",
    qualifications: [
      "STCW 95 (STCW 2010)",
      "ENG 1 (Medical Certificate)",
      "MCA Approved Engine Course (AEC 1 & 2) Certificate",
      "RYA Powerboat Level 2",
      "RYA Tender Operator Course",
      "BWSF Ski Boat Driver Award Certificate",
    ],
  },
];

export default function Home() {
  const [jobs, setJobs] = useState(JOBS);

  return (
    <>
      <SearchJobs />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div>{jobs.length} Jobs</div>

          {/* JOBS LIST */}
          <ul className="flex flex-col gap-2.5" role="list">
            {jobs.map((job) => (
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
    </>
  );
}
