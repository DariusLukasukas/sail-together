import CardMedia from "@/components/CardMedia";
import { Container } from "@/components/ui/container";
import { getEventById, getEventParticipants, toggleEventParticipation } from "@/features/events/api";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import Parse from "@/lib/parse/client";
import BaseMap from "@/components/map/BaseMap";
import type { GenericFeatureCollection } from "@/types/map";
import type { LocationAttributes } from "@/db/types/Location";

export default function EventPage() {
    const { eventId } = useParams<{ eventId: string }>()

    const { data, error } = useSWR(eventId ? `event-${eventId}` : null, () => getEventById(eventId!));
    const { data: participants = [], mutate: mutateParticipants } = useSWR(
        eventId ? `event-participants-${eventId}` : null,
        () => getEventParticipants(eventId!)
    );

    const [isJoining, setIsJoining] = useState(false);

    // Derive isParticipating from participants list 
    const isParticipating = useMemo(() => {
        const currentUser = Parse.User.current();
        if (!currentUser) return false;
        return participants.some(participant => participant.userId === currentUser.id);
    }, [participants]);

    // Map data must be calculated before early returns to maintain hook order
    const mapData = useMemo<GenericFeatureCollection | null>(() => {
        if (
            !data ||
            !data.locationId
        ) {
            return null;
        }

        const location = data.locationId as unknown as LocationAttributes;
        if (
            typeof location?.longitude !== "number" ||
            typeof location?.latitude !== "number"
        ) {
            return null;
        }

        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [location.longitude, location.latitude],
                    },
                    properties: {
                        id: data.id,
                        title: data.title,
                    },
                },
            ],
        };
    }, [data]);

    if (error) {
        return <div>Error loading event</div>
    }

    if (!data) {
        return null;
    }

    const { title, description, imageUrl, startDate, locationId, createdById, priceKind, priceAmount, priceCurrency } = data;
    const locationName = locationId?.name;
    const locationAddress = locationId?.address;
    const name = (createdById as any)?.name;
    const avatarUrl = (createdById as any)?.avatarUrl;

    const formattedDateTime = startDate
        ? format(startDate, "EEEE, MMMM do, yyyy 'at' h:mm a")
        : "Date and time TBD";

    const handleJoinLeave = async () => {
        if (!eventId || isJoining) return;

        setIsJoining(true);
        try {
            await toggleEventParticipation(eventId);
            await mutateParticipants(); // isParticipating will auto-update via useMemo
        } catch (err) {
            console.error("Failed to toggle participation:", err);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <Container className="container mx-auto max-w-6xl p-2">
            <article className="space-y-8">
                <header className="flex flex-col md:flex-row gap-6">
                    <CardMedia showHeart={false} src={imageUrl} className="w-full md:w-3/5 h-full" />
                    <div className="w-full flex flex-col gap-5 items-center">
                        <h1 className="font-bold text-3xl leading-tight">{title}</h1>
                        <p className="text-muted-foreground leading-none">{formattedDateTime}</p>

                        <p className="font-medium text-lg leading-none">
                            {priceKind === "paid" ? `${priceAmount} ${priceCurrency}` : "Free"}
                        </p>

                        <div className="h-px w-full bg-secondary" />

                        <div className="w-full flex flex-col gap-6 py-4">
                            <div className="w-full flex flex-row gap-3 items-center">
                                <Avatar className="size-10 shadow-md">
                                    <AvatarImage src={avatarUrl} />
                                </Avatar>
                                <p className="font-medium text-sm">Hosted by {name}</p>
                            </div>

                            <div className="flex flex-row gap-3 items-center">
                                <div className="border border-muted-foreground/20 rounded-xl size-10 flex items-center justify-center shadow-md text-muted-foreground">
                                    <Anchor className="size-4 stroke-3" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-medium text-sm">{locationName}</p>
                                    <p className="text-sm text-muted-foreground">{locationAddress}</p>
                                </div>
                            </div>
                        </div>

                        <section className="w-full border p-4 rounded-3xl border-border bg-card shadow-lg">
                            <div className="w-full flex flex-row justify-between items-center mb-4">
                                <h2 className="font-semibold">Event Participants</h2>
                                <Button
                                    variant={isParticipating ? "destructive" : "outline"}
                                    size="sm"
                                    className="rounded-full"
                                    onClick={handleJoinLeave}
                                    disabled={isJoining}
                                >
                                    {isJoining ? "Loading..." : isParticipating ? "Leave" : "Join"}
                                </Button>
                            </div>

                            {participants.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {participants.slice(0, 5).map((participant) => {
                                        const joinDate = new Date(participant.createdAt);
                                        const formattedJoinTime = formatDistanceToNow(joinDate, { addSuffix: true });

                                        return (
                                            <div key={participant.id} className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8">
                                                        <AvatarImage src={participant.userAvatarUrl || ""} />
                                                    </Avatar>
                                                    <p className="text-sm font-medium">
                                                        {participant.userDisplayName || participant.userName || "Anonymous"}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground whitespace-nowrap">
                                                    {formattedJoinTime}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No participants yet. Be the first to join!</p>
                            )}
                        </section>
                    </div>
                </header>

                <section>
                    <h2 className="text-xl font-semibold">Description</h2>
                    <p>{description}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold">Where the event will be happening</h2>
                    <div
                        aria-label="Map of event location"
                        className="my-4 h-60 w-full overflow-hidden rounded-3xl"
                    >
                        {mapData ? (
                            <BaseMap data={mapData} />
                        ) : (
                            <div className="bg-secondary text-muted-foreground flex h-full w-full items-center justify-center">
                                Map not available
                            </div>
                        )}
                    </div>
                    <p>{locationName ?? "Location not specified"}</p>
                    {locationAddress && (
                        <p className="text-muted-foreground text-sm">{locationAddress}</p>
                    )}
                </section>
            </article>
        </Container>
    )
}