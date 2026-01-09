import Parse from "@/lib/parse/client";
import { Event, type EventAttributes } from "@/db/types/Event";
import { Location } from "@/db/types/Location";
import type { _User } from "@/db/types/_User";
import type { Currency } from "@/types/event";
import type { EventSearchFilters } from "@/store/useEventStore";

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function parseToJSON<T>(obj: Event): T {
  const json = obj.toJSON();
  return {
    ...json,
    id: obj.id,
    startDate: obj.get("startDate"),
    endDate: obj.get("endDate") || null,
    priceAmount: obj.get("priceAmount") || null,
    isFavorite: obj.get("isFavorite") || false,
    imageUrl: obj.get("imageUrl") || undefined,
    createdAt: obj.get("createdAt"),
    updatedAt: obj.get("updatedAt"),
  } as T;
}

export async function getEvents(filters?: EventSearchFilters): Promise<EventAttributes[]> {
  const query = new Parse.Query(Event);
  query.include("locationId");
  query.include("createdById");
  query.ascending("startDate")

  // Filter by event type (category)
  if (filters?.eventType) {
    query.equalTo("categorySlug", filters.eventType);
  }

  // Filter by date range
  if (filters?.when?.from) {
    const fromDate = filters.when.from;
    // Set start of day (00:00:00)
    const startOfDay = new Date(fromDate);
    startOfDay.setHours(0, 0, 0, 0);
    query.greaterThanOrEqualTo("startDate", startOfDay);

    if (filters.when.to) {
      // If range is selected, use the end date
      const endDate = filters.when.to;
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.lessThanOrEqualTo("startDate", endOfDay);
    } else {
      // If single date is selected, set end to end of that day
      const endOfDay = new Date(fromDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.lessThanOrEqualTo("startDate", endOfDay);
    }
  }
  // If no date filter is specified, don't filter by date - show all events

  const results = await query.find();
  let events = results.map((event) => parseToJSON<EventAttributes>(event));

  // Filter by location
  if (filters?.where) {
    const searchTerm = filters.where.toLowerCase();
    
    // If coordinates are available, use proximity-based search (default: 50km radius)
    if (filters.whereCoordinates?.latitude && filters.whereCoordinates?.longitude) {
      const searchLat = filters.whereCoordinates.latitude;
      const searchLon = filters.whereCoordinates.longitude;
      const maxDistanceKm = 50; // Search radius in kilometers
      
      events = events.filter((event) => {
        const location = event.locationId;
        if (!location || !location.latitude || !location.longitude) return false;
        
        const distance = calculateDistance(
          searchLat,
          searchLon,
          location.latitude,
          location.longitude
        );
        
        return distance <= maxDistanceKm;
      });
    } else {
      // Fallback to text-based search if no coordinates available
      events = events.filter((event) => {
        const location = event.locationId;
        if (!location) return false;
        const locationName = (location.name || "").toLowerCase();
        const locationAddress = (location.address || "").toLowerCase();
        return locationName.includes(searchTerm) || locationAddress.includes(searchTerm);
      });
    }
  }

  return events;
}

export async function createEvent({
  title,
  description,
  startDate,
  endDate,
  categorySlug,
  location,
  priceKind,
  priceAmount,
  priceCurrency,
  imageFile,
}: {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  categorySlug: string;
  location: {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  priceKind: "free" | "paid";
  priceAmount?: number;
  priceCurrency?: Currency;
  imageFile?: File | null;
}): Promise<Event> {

  const currentUser = Parse.User.current() as _User | null;
  if (!currentUser) {
    throw new Error("User must be logged in to create an event");
  }

  // Upload image file if provided
  let imageUrl: string | undefined;
  if (imageFile) {
    const parseFile = new Parse.File(imageFile.name, imageFile);
    await parseFile.save();
    imageUrl = parseFile.url() || undefined;
  }

  // Create Location
  const locationObj = new Location();
  locationObj.name = location.name;
  locationObj.address = location.address;
  locationObj.longitude = location.longitude;
  locationObj.latitude = location.latitude;

  // Create Event
  const event = new Event();
  event.title = title;
  event.startDate = startDate;
  event.categorySlug = categorySlug;
  event.locationId = locationObj;
  event.priceKind = priceKind;
  event.createdById = currentUser;

  // Set optional fields
  if (description) event.description = description;
  if (endDate) event.endDate = endDate;
  if (imageUrl) event.imageUrl = imageUrl;
  if (priceKind === "paid" && priceAmount) {
    event.priceAmount = priceAmount;
    if (priceCurrency) event.priceCurrency = priceCurrency;
  }

  // Save - Parse will automatically save the Location first
  const saved = await event.save();
  return saved as Event;
}

export async function updateEvent(
  id: string,
  {
    title,
    description,
    startDate,
    endDate,
    categorySlug,
    location,
    priceKind,
    priceAmount,
    priceCurrency,
    imageFile,
    imageUrl,
  }: {
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    categorySlug?: string;
    location?: {
      name: string;
      address: string;
      longitude: number;
      latitude: number;
    };
    priceKind?: "free" | "paid";
    priceAmount?: number;
    priceCurrency?: Currency;
    imageFile?: File | null;
    imageUrl?: string;
  }
): Promise<Event> {
  const currentUser = Parse.User.current() as _User | null;
  if (!currentUser) {
    throw new Error("User must be logged in to update an event");
  }

  const query = new Parse.Query(Event);
  query.include("locationId");
  query.include("createdById");

  try {
    const event = await query.get(id);

    const createdById = event.get("createdById");
    if (createdById?.id !== currentUser.id) {
      throw new Error("Only the event creator can update this event");
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (startDate !== undefined) event.startDate = startDate;
    if (endDate !== undefined) event.endDate = endDate;
    if (categorySlug !== undefined) event.categorySlug = categorySlug;
    if (priceKind !== undefined) event.priceKind = priceKind;
    if (priceAmount !== undefined) event.priceAmount = priceAmount;
    if (priceCurrency !== undefined) event.priceCurrency = priceCurrency;

    // Handle image updates: prioritize new file over existing URL
    if (imageFile !== undefined) {
      if (imageFile) {
        // New file provided - upload it
        const parseFile = new Parse.File(imageFile.name, imageFile);
        await parseFile.save();
        event.imageUrl = parseFile.url() || undefined;
      }
      // If imageFile is explicitly null/undefined, don't change existing image
    } else if (imageUrl !== undefined) {
      // Only set imageUrl if imageFile wasn't provided
      event.imageUrl = imageUrl;
    }

    if (location !== undefined) {
      const locationObj = new Location();
      locationObj.name = location.name;
      locationObj.address = location.address;
      locationObj.longitude = location.longitude;
      locationObj.latitude = location.latitude;
      await locationObj.save();
      event.locationId = locationObj;
    }

    await event.save();
    return event as Event;
  } catch (err: any) {
    console.error("Failed to update event:", err.message);
    throw err;
  }
}

export async function toggleEventFavorite(id: string): Promise<boolean> {
  const query = new Parse.Query(Event);
  
  try {
    const event = await query.get(id);
    const newStatus = !event.isFavorite;
    event.isFavorite = newStatus;
    await event.save();
    return newStatus;
  } catch (err: any) {
    console.error("Failed to toggle favorite:", err.message);
    throw err;
  }
}

export async function getFavoriteEvents(): Promise<EventAttributes[]> {
  const query = new Parse.Query(Event);
  query.include("locationId");
  query.include("createdById");
  query.equalTo("isFavorite", true);
  query.descending("createdAt");

  const results = await query.find();
  return results.map((event) => parseToJSON<EventAttributes>(event));
}


export async function getEventById(id: string): Promise<EventAttributes | null> {
  const query = new Parse.Query(Event);

  query.include("locationId");
  query.include("createdById");

  try {
    const event = await query.get(id)

    if (!event) {
      return null;
    }

    const baseEvent = parseToJSON<EventAttributes>(event)

    return baseEvent
  }
  catch (err: any) {
    console.error("Failed to fetch event:", err.message);
    throw err;
  }
}

export interface EventParticipant {
  id: string;
  userId: string;
  userName: string | null;
  userAvatarUrl: string | null;
  userDisplayName: string | null;
  createdAt: Date;
}

export async function getEventParticipants(eventId: string): Promise<EventParticipant[]> {
  const eventPtr = new Parse.Object("Event");
  eventPtr.id = eventId;

  const query = new Parse.Query("EventParticipant");
  query.equalTo("eventId", eventPtr);
  query.include("userId");
  query.ascending("createdAt");

  try {
    const results = await query.find();
    const participants: EventParticipant[] = [];
    
    for (const participant of results) {
      if (!participant.id) continue;
      
      const user = participant.get("userId") as Parse.User | undefined;
      participants.push({
        id: participant.id,
        userId: user?.id ?? "",
        userName: (user && user.get("username")) ?? null,
        userAvatarUrl: (user && user.get("avatarUrl")) ?? null,
        userDisplayName: (user && user.get("name")) ?? null,
        createdAt: participant.createdAt ?? new Date(),
      });
    }
    
    return participants;
  } catch (err: any) {
    console.error("Failed to fetch event participants:", err.message);
    throw err;
  }
}

export async function toggleEventParticipation(eventId: string): Promise<{
  isParticipating: boolean;
  participantCount: number;
}> {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("Not authenticated");
  }

  const eventPtr = new Parse.Object("Event");
  eventPtr.id = eventId;

  const participantQuery = new Parse.Query("EventParticipant");
  participantQuery.equalTo("eventId", eventPtr);
  participantQuery.equalTo("userId", currentUser);
  participantQuery.limit(1);

  const existing = await participantQuery.first();

  if (existing) {
    // Leave event
    await existing.destroy();
    const participants = await getEventParticipants(eventId);
    return {
      isParticipating: false,
      participantCount: participants.length,
    };
  } else {
    // Join event
    const newParticipant = new Parse.Object("EventParticipant");
    newParticipant.set("eventId", eventPtr);
    newParticipant.set("userId", currentUser);
    await newParticipant.save();

    const participants = await getEventParticipants(eventId);
    return {
      isParticipating: true,
      participantCount: participants.length,
    };
  }
}

export async function isUserParticipating(eventId: string): Promise<boolean> {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    return false;
  }

  const eventPtr = new Parse.Object("Event");
  eventPtr.id = eventId;

  const query = new Parse.Query("EventParticipant");
  query.equalTo("eventId", eventPtr);
  query.equalTo("userId", currentUser);
  query.limit(1);

  try {
    const result = await query.first();
    return !!result;
  } catch (err: any) {
    console.error("Failed to check participation:", err.message);
    return false;
  }
}
