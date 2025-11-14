// React hooks wrapping the API calls
import { useState, useEffect, useCallback } from "react";
import { createEvent, getEvents } from "./api";
import type { EventWithRelations } from "@/types/event";
import type { CategorySlug } from "@/types/category";
import type { Currency } from "@/types/event";

export function useCreateEvent() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async ({
        title,
        description,
        startDate,
        endDate,
        categorySlug,
        locationId,
        priceKind,
        priceAmount,
        priceCurrency,
    }: {
        title: string;
        description?: string;
        startDate: Date;
        endDate?: Date;
        categorySlug: CategorySlug;
        locationId: string;
        priceKind: "free" | "paid";
        priceAmount?: number;
        priceCurrency?: Currency;
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createEvent({
                title,
                description,
                startDate,
                endDate,
                categorySlug,
                locationId,
                priceKind,
                priceAmount,
                priceCurrency,
            });
            return result;
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to create event";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { create, isLoading, error };
}

export function useEvents(limit?: number, autoFetch = true) {
    const [events, setEvents] = useState<EventWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(
        async (fetchLimit?: number) => {
            setIsLoading(true);
            setError(null);
            try {
                const results = await getEvents(fetchLimit ?? limit);
                setEvents(results);
                return results;
            } catch (err: any) {
                const message = err instanceof Error ? err.message : "Failed to fetch events";
                setError(message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [limit]
    );

    useEffect(() => {
        if (autoFetch) {
            fetchEvents();
        }
    }, [autoFetch, fetchEvents]);

    return { events, fetchEvents, isLoading, error };
}
