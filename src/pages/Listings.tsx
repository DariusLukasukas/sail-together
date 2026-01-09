import useSWR from "swr";
import { getCurrentUser } from "@/lib/parse/auth";
import { getJobs } from "@/features/jobs/api";
import { getEvents } from "@/features/events/api";
import { useToggleJobFavorite } from "@/features/jobs/useToggleJobFavorite";
import { useToggleEventFavorite } from "@/features/events/useToggleEventFavorite";
import type { JobAttributes } from "@/db/types/Job";
import type { EventAttributes } from "@/db/types/Event";
import CardMedia from "@/components/CardMedia";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

function formatJobDate(date: Date | string | undefined): string {
    if (!date) return "Date TBD";
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return "Invalid date";
        return format(d, "do MMM yyyy");
    } catch {
        return "Date TBD";
    }
}

function formatEventDate(date: Date | string | undefined): string {
    if (!date) return "Date TBD";
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return "Invalid date";
        return format(d, "do MMM yyyy");
    } catch {
        return "Date TBD";
    }
}

export default function Listings() {
    const user = getCurrentUser();
    const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useSWR<JobAttributes[]>("jobs", getJobs, {
        dedupingInterval: 10 * 60 * 1000, // 10 minutes
    });

    const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useSWR<EventAttributes[]>("events", getEvents, {
        dedupingInterval: 10 * 60 * 1000, // 10 minutes
    });

    const toggleJobFavorite = useToggleJobFavorite("jobs");
    const toggleEventFavorite = useToggleEventFavorite("events");

    const jobs = (jobsData ?? []).filter((j: any) => {
        const ownerId =
            j?.createdById?.objectId ??
            j?.createdById;
        return ownerId === user?.id;
    });

    const events = (eventsData ?? []).filter((e: any) => {
        const ownerId =
            e?.createdById?.objectId ??
            e?.createdById;
        return ownerId === user?.id;
    });

    const isLoading = jobsLoading || eventsLoading;
    const hasError = jobsError || eventsError;
    const totalListings = jobs.length + events.length;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Your Listings</h1>
                <p className="text-muted-foreground mt-2">
                    {totalListings > 0
                        ? `You have ${totalListings} listing${totalListings === 1 ? "" : "s"} (${jobs.length} job${jobs.length === 1 ? "" : "s"}, ${events.length} event${events.length === 1 ? "" : "s"})`
                        : "No listings yet"}
                </p>
            </div>

            {/* Jobs Section */}
            {(jobs.length > 0 || jobsLoading) && (
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Jobs</h2>
                    {jobsError && (
                        <div className="text-destructive mb-4">
                            Error loading jobs: {jobsError.message}
                        </div>
                    )}
                    {jobsLoading && !jobsError ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="aspect-square w-full animate-pulse rounded-3xl bg-muted" />
                            ))}
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {jobs.map((job) => {
                                const loc = job.locationId as any;
                                return (
                                    <Link key={job.id} to={`/jobs/${job.id}/edit`}>
                                        <div
                                            aria-label="listing-card"
                                            className={cn("flex aspect-square w-full flex-col gap-2")}
                                        >
                                            <CardMedia
                                                isFavorite={job.isFavorite ?? false}
                                                onFavoriteClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleJobFavorite?.(job.id);
                                                }}
                                                src={job.imageUrl}
                                            />

                                            <div className="flex w-full flex-col gap-1 px-1">
                                                <h3 className="truncate font-semibold leading-tight">{job.title}</h3>
                                                <p className="text-muted-foreground truncate text-sm leading-none">
                                                    {job.type} · {formatJobDate(job.date)}
                                                </p>
                                                <p className="text-muted-foreground truncate text-sm leading-none">
                                                    {loc?.name ?? loc?.address ?? "Location not specified"}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        !jobsLoading && (
                            <div className="text-muted-foreground text-sm">No jobs yet</div>
                        )
                    )}
                </div>
            )}

            {/* Events Section */}
            {(events.length > 0 || eventsLoading) && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Events</h2>
                    {eventsError && (
                        <div className="text-destructive mb-4">
                            Error loading events: {eventsError.message}
                        </div>
                    )}
                    {eventsLoading && !eventsError ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="aspect-square w-full animate-pulse rounded-3xl bg-muted" />
                            ))}
                        </div>
                    ) : events.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {events.map((event) => {
                                const loc = event.locationId as any;
                                return (
                                    <Link key={event.id} to={`/events/${event.id}/edit`}>
                                        <div
                                            aria-label="listing-card"
                                            className={cn("flex aspect-square w-full flex-col gap-2")}
                                        >
                                            <CardMedia
                                                isFavorite={event.isFavorite ?? false}
                                                onFavoriteClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleEventFavorite?.(event.id);
                                                }}
                                                src={event.imageUrl}
                                                priceKind={event.priceKind}
                                            />

                                            <div className="flex w-full flex-col gap-1 px-1">
                                                <h3 className="truncate font-semibold leading-tight">{event.title}</h3>
                                                <p className="text-muted-foreground truncate text-sm leading-none">
                                                    {formatEventDate(event.startDate)}
                                                </p>
                                                <p className="text-muted-foreground truncate text-sm leading-none">
                                                    {loc?.name ?? loc?.address ?? "Location not specified"}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        !eventsLoading && (
                            <div className="text-muted-foreground text-sm">No events yet</div>
                        )
                    )}
                </div>
            )}

            {/* Empty State - only show if both are loaded and both are empty */}
            {!isLoading && !hasError && totalListings === 0 && (
                <div className="text-muted-foreground text-center py-12">
                    You don't have any listings yet. Create your first job or event to get started!
                </div>
            )}
        </main>
    );
}