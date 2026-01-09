import Parse from "parse";

import type { Event } from "./Event";
import type { _User } from "./_User";

export interface EventParticipantAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  eventId: Event;
  userId: _User;
}

export class EventParticipant extends Parse.Object<EventParticipantAttributes> {
  static className: string = "EventParticipant";

  constructor(data?: Partial<EventParticipantAttributes>) {
    super("EventParticipant", data as EventParticipantAttributes);
  }

  get eventId(): Event {
    return super.get("eventId");
  }
  set eventId(value: Event) {
    super.set("eventId", value);
  }

  get userId(): _User {
    return super.get("userId");
  }
  set userId(value: _User) {
    super.set("userId", value);
  }
}

Parse.Object.registerSubclass("EventParticipant", EventParticipant);
