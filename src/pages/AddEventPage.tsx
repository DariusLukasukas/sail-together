import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import AddEventForm from "@/components/forms/AddEventForm";

export default function AddEventPage() {
  const navigate = useNavigate();

  return (
    <main className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Add Event</h1>
      <AddEventForm
        onSuccess={() => {
          mutate("events");
          navigate("/events");
        }}
        onCancel={() => navigate("/events")}
      />
    </main>
  );
}
