import { useParams, useNavigate } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { getEventById } from "@/features/events/api";
import AddEventForm from "@/components/forms/AddEventForm";

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading } = useSWR(
    eventId ? `event-${eventId}` : null,
    () => getEventById(eventId!)
  );

  const handleSuccess = () => {
    mutate(`event-${eventId}`);
    mutate("events"); // Also refresh events list
    navigate(`/events/${eventId}`);
  };

  const handleCancel = () => {
    navigate(`/events/${eventId}`);
  };

  if (isLoading || !event) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="py-12 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Event: {event.title}</h1>
      <AddEventForm
        mode="edit"
        event={event}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        submitLabel="Update Event"
      />
    </main>
  );
}
