import { Button } from "@/components/ui/Button";
import { MapPin, Briefcase, CalendarClock } from "lucide-react";

const NAV = [
  { label: "Jobs in map area", icon: <MapPin /> },
  { label: "All positions", icon: <Briefcase /> },
  { label: "Availability", icon: <CalendarClock /> },
];

interface FilterBarProps {
  activeTab: string | null;
  setActiveTab: (tab: string) => void;
}

export function FilterBar({ activeTab, setActiveTab }: FilterBarProps) {
  return (
    <nav aria-label="Job filters" className="flex justify-center py-6">
      <div
        aria-label="Filter jobs"
        className="flex items-center gap-2 rounded-full bg-neutral-200 p-2"
      >
        {NAV.map((item) => {
          return (
            <Button
              key={item.label}
              size={"sm"}
              className=""
              variant={activeTab?.includes(item.label) ? "filterActive" : "filter"}
              onClick={() => setActiveTab(item.label)}
            >
              {item.icon}
              {item.label}
            </Button>
          );
        })}
        <Button type="button" variant="search" size={"xs"} aria-label="Search jobs">
          Search
        </Button>
      </div>
    </nav>
  );
}
