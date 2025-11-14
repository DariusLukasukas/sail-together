import SearchEvent from "@/components/searchbar/SearchEvent";
// import Map from "@/components/map/Map";
import EventSidebar from "@/components/EventSidebar";
// import { eventsToGeoJson } from "@/lib/eventsToGeoJSON";
import { useEvents } from "@/features/events/hooks";
import AddEventForm from "@/components/forms/AddEventForm";
import { Spinner } from "@/components/ui/spinner";

export default function Events() {
  const { events, isLoading, error, fetchEvents } = useEvents(20, true);

  // const eventsGeoJSON = useMemo(() => eventsToGeoJson(events), [events]);

  return (
    <>
      <SearchEvent />
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        <aside className="flex flex-col gap-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          )}
          {error && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-xl border px-3 py-2 text-center text-sm font-medium">
              {error}
            </div>
          )}
          {!isLoading && !error && <EventSidebar events={events} />}
        </aside>

        <section>
          <div className="sticky top-14 h-[calc(100dvh-56px-16px-48px-16px)] min-h-fit py-6">
            {/* <Map events={eventsGeoJSON} /> */}

            {/* TEMPORARY DEV PANEL */}
            <div className="rounded-xl border-3 border-orange-500 p-4">
              <p className="text-xl font-bold text-orange-500 uppercase">Dev Panel</p>
              <AddEventForm
                onSuccess={() => {
                  // Refresh events after successful creation
                  fetchEvents();
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
