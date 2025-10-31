import { cn } from "@/lib/utils";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { addDays, format, isSaturday, isSunday, nextSaturday } from "date-fns";
import { MapPin, Briefcase, CalendarClock } from "lucide-react";
import { useEffect, useReducer } from "react";
import { useClickAway } from "@uidotdev/usehooks";

interface Location {
  location: string;
}

interface JobTypeOption {
  profession: string;
}

const LOCATIONS: Location[] = [
  { location: "Jobs in map area" },
  { location: "All locations" },
  { location: "Atlantic Crossing" },
  { location: "Mediterranean" },
  { location: "North America" },
  { location: "South America" },
  { location: "Northern Europe" },
  { location: "UK" },
  { location: "Pacific" },
  { location: "Caribbean" },
  { location: "Australia" },
  { location: "Asia" },
  { location: "Africa" },
];

const JOB_TYPE_OPTIONS: JobTypeOption[] = [
  { profession: "All positions" },
  { profession: "Bosun" },
  { profession: "Captain" },
  { profession: "Chef" },
  { profession: "Deck" },
  { profession: "Deckhand" },
  { profession: "Engineer" },
  { profession: "Electro-Technical Officer" },
  { profession: "First Officer" },
  { profession: "Interior" },
  { profession: "Pastry Chef" },
  { profession: "Purser" },
  { profession: "Sous Chef" },
  { profession: "Steward(ess)" },
  { profession: "Chief Stewardess" },
  { profession: "Second Stewardess" },
  { profession: "Third Stewardess" },
  { profession: "Chief Engineer" },
  { profession: "Second Engineer" },
  { profession: "Third Engineer" },
  { profession: "Medical Staff" },
  { profession: "Other" },
];

const NAV = [
  { label: "Jobs in map area", icon: <MapPin /> },
  { label: "All positions", icon: <Briefcase /> },
  { label: "Availability", icon: <CalendarClock /> },
] as const;

type Step = (typeof NAV)[number];

type State = {
  isOpen: boolean;
  stepIndex: number;
  location: string | null;
  position: string | null;
  availability?: DateRange | undefined;
};

export type Filters = {
  location?: string | null;
  position?: string | null;
  availability?: DateRange | undefined;
  activeTab?: string;
};

type Action =
  | { type: "OPEN"; stepIndex: number }
  | { type: "CLOSE" }
  | { type: "TOGGLE_TAB"; index: number }
  | { type: "NEXT_STEP" }
  | { type: "SET_LOCATION"; value: string | null }
  | { type: "SET_POSITION"; value: string | null }
  | { type: "SET_AVAILABILITY"; value: DateRange | undefined };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true, stepIndex: action.stepIndex ?? state.stepIndex };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE_TAB":
      if (state.isOpen && state.stepIndex === action.index) {
        return { ...state, isOpen: false };
      }
      return { ...state, isOpen: true, stepIndex: action.index };
    case "NEXT_STEP":
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, NAV.length - 1) };
    case "SET_LOCATION":
      return { ...state, location: action.value };
    case "SET_POSITION":
      return { ...state, position: action.value };
    case "SET_AVAILABILITY":
      return { ...state, availability: action.value };
    default:
      return state;
  }
}

function labelForRange(r?: DateRange) {
  if (!r?.from) return "Availability";
  if (!r.to || r.to.getTime() === r.from.getTime()) return format(r.from, "dd MMM");
  const sameMonth = format(r.from, "MMM") === format(r.to, "MMM");
  return sameMonth
    ? `${format(r.from, "d")}–${format(r.to, "d MMM")}`
    : `${format(r.from, "d MMM")}–${format(r.to, "d MMM")}`;
}

export default function FilterBar({
  onSearch,
  disabled = false,
}: {
  onSearch?: (filters: Filters) => void;
  disabled?: boolean;
}) {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    stepIndex: 0,
    location: null,
    position: null,
    availability: undefined,
  });

  useEffect(() => {
    onSearch?.({
      location: state.location,
      position: state.position,
      availability: state.availability,
      activeTab: NAV[state.stepIndex].label,
    });
  }, [state.location, state.position, state.availability, state.stepIndex]);

  const handleSearch = () => {
    const filters: Filters = {
      location: state.location,
      position: state.position,
      availability: state.availability,
      activeTab: NAV[state.stepIndex].label,
    };
    onSearch?.(filters);
    dispatch({ type: "CLOSE" });
  };

  useEffect(() => {
    if (!state.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.isOpen]);

  const canSearch = !!state.location && !!state.position && !!state.availability?.from;

  const containerRef = useClickAway<HTMLDivElement>(() => {
    dispatch({ type: "CLOSE" });
  });

  const activeTab: Step = NAV[state.stepIndex];

  const tabLabel = (step: Step) => {
    switch (step.label) {
      case "Jobs in map area":
        return state.location ?? "Jobs in map area";
      case "All positions":
        return (
          JOB_TYPE_OPTIONS.find((type) => type.profession === state.position)?.profession ??
          "All positions"
        );
      case "Availability":
        return labelForRange(state.availability) ?? "Availability";
      default:
        return "";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center"
    >
      <div
        role="tablist"
        aria-label="Search filters"
        tabIndex={-1}
        className="grid w-full grid-cols-4 items-center gap-2 rounded-full bg-neutral-200 p-1.5"
      >
        {NAV.map((step, i) => {
          const isTabActive = state.isOpen && state.stepIndex === i;
          const tabId = `tab-${step.label.toLowerCase()}`;
          const panelId = `panel-${step.label.toLowerCase()}`;
          return (
            <button
              key={step.label}
              role="tab"
              id={tabId}
              aria-controls={panelId}
              aria-selected={isTabActive}
              type="button"
              className={cn(
                "focus-visible:border-ring flex justify-start truncate rounded-full px-3 py-1.5 font-medium outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isTabActive ? "bg-black text-white" : "text-primary hover:bg-accent/80"
              )}
              onClick={() => !disabled && dispatch({ type: "TOGGLE_TAB", index: i })}
            >
              <span className="inline-flex items-center gap-2">
                {step.icon}
                <span>{tabLabel(step)}</span>
              </span>
            </button>
          );
        })}

        <button
          disabled={!canSearch}
          onClick={handleSearch}
          className="rounded-full bg-blue-500 px-3 py-1.5 font-medium text-white disabled:pointer-events-none disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {state.isOpen && (
        <div
          role="tabpanel"
          id={`panel-${activeTab.label.toLowerCase()}`}
          aria-labelledby={`tab-${activeTab.label.toLowerCase()}`}
          className="bg-card absolute top-full z-40 mt-2 w-full overflow-hidden rounded-3xl py-6 shadow-lg inset-shadow-2xs"
        >
          <div className="h-full max-h-96 w-full overflow-y-auto">
            {activeTab.label === "Jobs in map area" && (
              <div className="flex flex-col gap-4 px-6">
                <div>
                  <div className="flex flex-col gap-0.5 py-1">
                    {LOCATIONS.map((loc) => {
                      return (
                        <button
                          key={loc.location}
                          type="button"
                          tabIndex={0}
                          className="hover:bg-secondary focus-visible:border-ring flex w-full flex-row gap-4 rounded-md p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          onClick={() => {
                            const next = state.location === loc.location ? null : loc.location;
                            dispatch({ type: "SET_LOCATION", value: next });
                            if (next) dispatch({ type: "NEXT_STEP" });
                          }}
                        >
                          <div className="flex flex-col justify-center text-sm font-medium">
                            <p>{loc.location}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab.label === "All positions" && (
              <div className="flex flex-col px-6">
                <div className="flex flex-col gap-0.5 py-1">
                  {JOB_TYPE_OPTIONS.map((type) => (
                    <button
                      key={type.profession}
                      type="button"
                      tabIndex={0}
                      className="hover:bg-secondary focus-visible:border-ring flex flex-row gap-4 rounded-md p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      onClick={() => {
                        const next = state.position === type.profession ? null : type.profession;
                        dispatch({ type: "SET_POSITION", value: next });
                        if (next) dispatch({ type: "NEXT_STEP" });
                      }}
                    >
                      <div className="flex flex-col justify-center text-sm font-medium">
                        <p>{type.profession}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab.label === "Availability" && (
              <WhenPanel
                value={state.availability}
                onChange={(range) => dispatch({ type: "SET_AVAILABILITY", value: range })}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface WhenPanelProps {
  value?: DateRange;
  onChange: (range?: DateRange) => void;
}

function fmt(d: Date) {
  return format(d, "MMM d");
}

function WhenPanel({ value, onChange }: WhenPanelProps) {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  // weekend [Sat..Sun]
  let sat: Date, sun: Date;
  if (isSaturday(today)) {
    sat = today;
    sun = addDays(today, 1);
  } else if (isSunday(today)) {
    sat = addDays(today, -1);
    sun = today;
  } else {
    sat = nextSaturday(today);
    sun = addDays(sat, 1);
  }

  const picks = [
    { key: "today", label: "Today", range: { from: today, to: today }, sub: fmt(today) },
    {
      key: "tomorrow",
      label: "Tomorrow",
      range: { from: tomorrow, to: tomorrow },
      sub: fmt(tomorrow),
    },
    {
      key: "weekend",
      label: "This weekend",
      range: { from: sat, to: sun },
      sub: `${fmt(sat)} — ${format(sun, "d")}`,
    },
  ] as const;

  // Helpers to compare dates/ranges ignoring time
  const sameDate = (a?: Date, b?: Date) => !!a && !!b && a.toDateString() === b.toDateString();

  const sameRange = (a?: DateRange, b?: DateRange) => {
    if (!a?.from || !b?.from) return false;
    const aTo = a.to ?? a.from;
    const bTo = b.to ?? b.from;
    return sameDate(a.from, b.from) && sameDate(aTo, bTo);
  };

  const activeQuick = picks.find((p) => sameRange(value, p.range))?.key ?? null;

  return (
    <div className="flex flex-row gap-6 px-6">
      <div className="flex min-h-full w-full flex-col gap-4 py-1">
        {picks.map((p) => {
          const isActive = activeQuick === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                onChange(isActive ? undefined : p.range);
              }}
              className={cn(
                "grow rounded-2xl border p-4 text-left transition-transform duration-150 active:scale-95",
                isActive ? "bg-accent/50 border-blue-500 ring-2 ring-blue-500" : "border-border"
              )}
            >
              <p className="font-semibold">{p.label}</p>
              <p className="text-muted-foreground text-sm">{p.sub}</p>
            </button>
          );
        })}
      </div>
      <div className="shrink-0 py-1.5">
        <DayPicker
          required
          animate
          mode="range"
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from ?? today}
          weekStartsOn={1}
          classNames={{
            today: `text-blue-500 p-1`,
            selected: ``,
            range_start: "bg-black text-white rounded-l-full",
            range_end: "bg-black text-white rounded-r-full",
            range_middle: "bg-secondary text-foreground",
            chevron: `text-primary`,
            day: "font-medium",
          }}
        />
      </div>
    </div>
  );
}
