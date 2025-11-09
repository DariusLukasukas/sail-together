import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Heart, Clock, CalendarDays, Ship, MapPin, X, Link2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types/job";
import { Container } from "@/components/ui/container";
import { Media, MediaFallback } from "@/components/ui/media";
import BaseMap from "@/components/map/BaseMap";
import { jobsToGeoJSON } from "@/lib/jobsToGeoJSON";

export default function JobPage() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const location = useLocation();
  const jobFromState = (location.state as { job?: Job } | null)?.job;
  const job: Job | null = jobFromState ?? null;

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

  if (!job) return <Navigate to="/404" replace />;

  return (
    <Container className="container mx-auto max-w-6xl p-2">
      <article className="space-y-8">
        <header className="flex flex-row gap-2.5">
          <Media className="hidden size-24 rounded-3xl md:block">
            <Heart
              className={`absolute top-2.5 right-2.5 cursor-pointer transition ${
                job.isFavorite ? "fill-red-500 text-red-500" : "fill-neutral-400 text-neutral-400"
              }`}
            />
            <MediaFallback className="bg-neutral-300" />
          </Media>

          <div data-slot="job-summary" className="flex flex-col justify-center gap-0.5">
            <h1 className="text-2xl font-semibold">{job.title}</h1>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <dt className="sr-only">Type</dt>
              <dd className="flex items-center gap-1">
                <Clock className="size-5 text-neutral-400" />
                {job.type}
              </dd>

              <dt className="sr-only">Posted</dt>
              <dd className="flex items-center gap-1">
                <CalendarDays className="size-5 text-neutral-400" />
                {job.date}
              </dd>

              <dt className="sr-only">Vessel</dt>
              <dd className="flex items-center gap-1">
                <Ship className="size-5 text-neutral-400" />
                {job.vessel}
              </dd>

              <dt className="sr-only">Location</dt>
              <dd className="flex items-center gap-1">
                <MapPin className="size-5 text-neutral-400" />
                {job.location.name}
              </dd>
            </dl>
          </div>

          <div data-slot="actions" className="ml-auto flex flex-row gap-2">
            <Button
              onClick={() => setShareOpen(true)}
              className="rounded-xl bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
            >
              Share
            </Button>
            <Button
              onClick={() => setApplyOpen(true)}
              className="rounded-xl bg-green-500 text-white hover:bg-green-600"
            >
              Apply
            </Button>
          </div>
        </header>

        <section>
          <h2 className="text-xl font-semibold">Job description</h2>
          <p>{job.meta.description}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Requirements</h2>
          <ul className="list-inside list-disc">
            {job.meta.requirements.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Experience</h2>
          <p>{job.meta.experience}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Essential Qualifications</h2>
          <ul className="grid list-inside list-disc grid-cols-1 md:grid-cols-2">
            {job.meta.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Where you’ll be working</h2>
          {/*<div
            aria-label="Map placeholder"
            className="my-4 h-60 w-full overflow-hidden rounded-3xl"
          >
            <div className="size-full bg-neutral-200" />
          </div>*/}

          <div
            aria-label="Map of job location"
            className="my-4 h-60 w-full overflow-hidden rounded-3xl"
          >
            <BaseMap data={jobsToGeoJSON([job])} />
          </div>
          <p>{job.location.name}</p>
        </section>
      </article>

      {/* Apply Modal */}
      {applyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
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
              <h3 className="text-lg font-semibold" id="apply-modal-title">
                Apply for {job.title} position
              </h3>
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
                <label className="text-xl font-semibold">Full name*</label>
                <input
                  required
                  name="fullName"
                  placeholder="Johny"
                  className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-neutral-500 ring-0 outline-none focus:border-neutral-300"
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <label className="text-xl font-semibold">Email address*</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-neutral-500 ring-0 outline-none focus:border-neutral-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xl font-semibold">Phone number*</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="+45"
                  className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-neutral-500 ring-0 outline-none focus:border-neutral-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xl font-semibold">Resume*</label>
                <label className="flex cursor-pointer items-center justify-center rounded-xl border border-neutral-200 p-6 text-neutral-500">
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
                  <div className="text-xl font-semibold">Copy Link</div>
                  <div className="text-neutral-500">Share via link</div>
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
                  <div className="text-xl font-semibold">Email</div>
                  <div className="text-neutral-500">Share via email</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
