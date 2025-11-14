// React hooks wrapping the API calls
import { useState } from "react";
import { createEvent, getEvents } from "./api";
import type { Event } from "@/types/event";
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

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async (limit?: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await getEvents(limit);
            setEvents(results);
            return results;
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to fetch events";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { events, fetchEvents, isLoading, error };
}
