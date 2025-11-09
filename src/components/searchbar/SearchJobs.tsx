import { cn } from "@/lib/utils";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { addDays, format, isSaturday, isSunday, nextSaturday } from "date-fns";
import { MapPin, Briefcase, CalendarClock } from "lucide-react";
import { useEffect, useReducer } from "react";
import { useClickAway } from "@uidotdev/usehooks";

interface SuggestedLocation {
  name: string;
  description?: string;
  className?: string;
}

interface JobType {
  id: string;
  label: string;
  className?: string;
}

const LOCATIONS: SuggestedLocation[] = [
  { name: "Atlantic Crossing", className: "bg-blue-100" },
  { name: "Mediterranean", className: "bg-green-100" },
  { name: "North America", className: "bg-yellow-100" },
  { name: "South America", className: "bg-red-100" },
  { name: "Northern Europe", className: "bg-purple-100" },
  { name: "UK", className: "bg-pink-100" },
  { name: "Pacific", className: "bg-orange-100" },
  { name: "Caribbean", className: "bg-cyan-100" },
  { name: "Australia", className: "bg-teal-100" },
  { name: "Asia", className: "bg-indigo-100" },
  { name: "Africa", className: "bg-gray-100" },
];

const JOB_TYPE_OPTIONS: JobType[] = [
  { id: "steeward", label: "Steeward/Stewardess", className: "bg-purple-100" },
  { id: "deckhand", label: "Deckhand", className: "bg-green-100" },
  { id: "first-mate", label: "First Mate", className: "bg-yellow-100" },
  { id: "captain", label: "Captain", className: "bg-orange-100" },
  { id: "engineer", label: "Engineer", className: "bg-blue-100" },
  { id: "chef", label: "Chef", className: "bg-red-100" },
];

const STEPS = [
  { label: "Where", icon: <MapPin /> },
  { label: "What", icon: <Briefcase /> },
  { label: "When", icon: <CalendarClock /> },
] as const;
type Step = (typeof STEPS)[number];

type State = {
  isOpen: boolean;
  stepIndex: number;
  name: string | null;
  position: string | null;
  availability?: DateRange | undefined;
};

export type Filters = {
  name?: string | null;
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
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, STEPS.length - 1) };
    case "SET_LOCATION":
      return { ...state, name: action.value };
    case "SET_POSITION":
      return { ...state, position: action.value };
    case "SET_AVAILABILITY":
      return { ...state, availability: action.value };
    default:
      return state;
  }
}

function labelForRange(r?: DateRange) {
  if (!r?.from) return "When";
  if (!r.to || r.to.getTime() === r.from.getTime()) return format(r.from, "dd MMM");
  const sameMonth = format(r.from, "MMM") === format(r.to, "MMM");
  return sameMonth
    ? `${format(r.from, "d")}–${format(r.to, "d MMM")}`
    : `${format(r.from, "d MMM")}–${format(r.to, "d MMM")}`;
}

export default function SearchJobs() {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    stepIndex: 0,
    name: null,
    position: null,
    availability: undefined,
  });

  const containerRef = useClickAway<HTMLDivElement>(() => {
    dispatch({ type: "CLOSE" });
  });

  const activeTab: Step = STEPS[state.stepIndex];

  const tabLabel = (step: Step) => {
    switch (step.label) {
      case "Where":
        return state.name ?? "Where";
      case "What":
        return JOB_TYPE_OPTIONS.find((type) => type.label === state.position)?.label ?? "What";
      case "When":
        return labelForRange(state.availability) ?? "When";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (!state.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.isOpen]);

  const canSearch = !!state.name && !!state.position && !!state.availability?.from;

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
        {STEPS.map((step, i) => {
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
              onClick={() => dispatch({ type: "TOGGLE_TAB", index: i })}
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
          onClick={() => dispatch({ type: "CLOSE" })}
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
          <div className="h-full max-h-96 w-full overflow-y-auto overscroll-contain">
            {activeTab.label === "Where" && (
              <div className="flex flex-col gap-4 px-6">
                <div>
                  <p className="mb-2 text-xs font-medium">Suggested locations</p>
                  <div className="flex flex-col gap-0.5 py-1">
                    {LOCATIONS.map((loc) => {
                      return (
                        <button
                          key={loc.name}
                          type="button"
                          tabIndex={0}
                          className="hover:bg-secondary focus-visible:border-ring flex w-full flex-row gap-4 rounded-2xl p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          onClick={() => {
                            const next = state.name === loc.name ? null : loc.name;
                            dispatch({ type: "SET_LOCATION", value: next });
                            if (next) dispatch({ type: "NEXT_STEP" });
                          }}
                        >
                          <div className={cn("size-14 rounded-lg bg-orange-100", loc.className)} />
                          <div className="flex flex-col justify-center text-sm font-medium">
                            <p>{loc.name}</p>
                            <p className="text-muted-foreground">{loc.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab.label === "What" && (
              <div className="flex flex-col px-6">
                <div className="flex flex-col gap-0.5 py-1">
                  {JOB_TYPE_OPTIONS.map((type) => (
                    <button
                      key={type.label}
                      type="button"
                      tabIndex={0}
                      className="hover:bg-secondary focus-visible:border-ring flex flex-row gap-4 rounded-2xl p-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      onClick={() => {
                        const next = state.position === type.label ? null : type.label;
                        dispatch({ type: "SET_POSITION", value: next });
                        if (next) dispatch({ type: "NEXT_STEP" });
                      }}
                    >
                      <div className={cn("size-14 rounded-lg bg-orange-100", type.className)} />
                      <div className="flex flex-col justify-center text-sm font-medium">
                        <p>{type.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab.label === "When" && (
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
