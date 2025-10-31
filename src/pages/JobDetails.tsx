import { useLocation } from "react-router-dom";
import { Heart, Clock, CalendarDays, Ship, MapPin, X, Link2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useEffect } from "react";
import type { Job } from "@/types/job";

export default function JobDetails() {
  const location = useLocation();
  const jobFromState = (location.state as { job?: Job } | null)?.job;
  const [applyOpen, setApplyOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const job: Job | null = jobFromState ?? null;

  if (!job) return null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setApplyOpen(false);
        setShareOpen(false);
      }
    };
    if (applyOpen || shareOpen) {
      document.addEventListener("keydown", onKey);
      document.body.classList.add("overflow-hidden");
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [applyOpen, shareOpen]);

  return (
    <div>
      <div className="px-24 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2.5">
            <div className="relative size-24 rounded-3xl bg-neutral-300">
              <Heart
                className={`absolute top-2.5 right-2.5 cursor-pointer transition ${
                  job.favorite ? "fill-red-500 text-red-500" : "fill-neutral-400 text-neutral-400"
                }`}
              />
            </div>
            <div className="flex flex-col justify-between py-2">
              <h2 className="font-semibold">{job.title}</h2>
              <div className="flex items-center gap-x-4">
                <p className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-neutral-400" /> <span>{job.type}</span>
                </p>
                <p className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5 text-neutral-400" /> <span>{job.date}</span>
                </p>
              </div>
              <div className="flex items-center gap-x-4">
                <p className="flex items-center gap-1">
                  <Ship className="h-3.5 w-3.5 text-neutral-400" /> <span>{job.vessel}</span>
                </p>
                <p className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" /> <span>{job.location}</span>
                </p>
              </div>
            </div>
            <div className="ml-auto flex flex-col gap-4">
              <span className="flex gap-2">
                <Button
                  className="rounded-xl bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                  size={"default"}
                  onClick={() => setShareOpen(true)}
                >
                  Share
                </Button>
                <Button
                  className="rounded-xl bg-green-500 text-white hover:bg-green-600"
                  size={"default"}
                  onClick={() => setApplyOpen(true)}
                >
                  Apply
                </Button>
              </span>
            </div>
          </div>

          {/* Description sections */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-1 font-medium">Job description</div>
              <div className="text-sm">{job.jobDescription}</div>
            </div>
            <div>
              <div className="mb-1 font-medium">Requirements</div>
              <div className="text-sm">
                <ul>
                  {job.requirements.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="mb-1 font-medium">Experience</div>
              <div className="text-sm">{job.experience}</div>
            </div>
            <div>
              <div className="mb-1 font-medium">Essential Qualifications</div>
              <div className="text-sm">
                <ul>
                  {job.qualifications.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="mb-1 font-medium">Current location</div>
            <div className="mb-2 text-sm">{job.location}</div>
            <div className="overflow-hidden rounded-3xl">
              <div className="h-64 w-full bg-neutral-200" />
            </div>
          </div>
        </div>

        {/* Apply Modal */}
        {applyOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
              onClick={() => setApplyOpen(false)}
            />
            <div
              className="relative z-10 w-4/12 max-w-3xl rounded-2xl bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Apply for {job.title} position</h3>
                <button
                  aria-label="Close"
                  className="rounded-md p-1 hover:bg-neutral-100"
                  onClick={() => setApplyOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setApplyOpen(false);
                }}
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium">Full name*</label>
                  <input
                    required
                    name="fullName"
                    placeholder="Johny"
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-neutral-500 ring-0 outline-none focus:border-neutral-300"
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email address*</label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-neutral-500 ring-0 outline-none focus:border-neutral-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Phone number*</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="+45"
                    className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-neutral-500 ring-0 outline-none focus:border-neutral-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Resume*</label>
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-neutral-200 p-6 text-sm text-neutral-500">
                    <input type="file" name="resume" className="hidden" required />
                    Click here to upload or drop files here*
                  </label>
                </div>
                <Button
                  type="submit"
                  size="default"
                  className="w-full rounded-xl bg-green-500 text-white hover:bg-green-600"
                >
                  Apply
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {shareOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
              onClick={() => setShareOpen(false)}
            />
            <div
              className="relative z-10 w-96 max-w-2xl rounded-2xl bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Share {job.title} position</h3>
                <button
                  aria-label="Close"
                  className="rounded-md p-1 hover:bg-neutral-100"
                  onClick={() => setShareOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 p-4 text-left transition-colors hover:bg-neutral-50"
                >
                  <Link2 className="h-5 w-5 text-neutral-600" />
                  <div>
                    <div className="font-medium">Copy Link</div>
                    <div className="text-sm text-neutral-500">Share via link</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    const subject = encodeURIComponent(`Job Opportunity: ${job.title}`);
                    const body = encodeURIComponent(
                      `Check out this job: ${job.title}\n\n${window.location.href}`
                    );
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 p-4 text-left transition-colors hover:bg-neutral-50"
                >
                  <Mail className="h-5 w-5 text-neutral-600" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-neutral-500">Share via email</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
