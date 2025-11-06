import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";

type QKind = "radio" | "date" | "map" | "input";

type BaseQ = {
  id: number;
  kind: QKind;
  title: string;
  description?: string;
};

type RadioQ = BaseQ & {
  kind: "radio";
  options: readonly string[];
};

type DateQ = BaseQ & { kind: "date" };
type MapQ = BaseQ & { kind: "map" };
type InputQ = BaseQ & { kind: "input"; placeholder?: string };

type Question = RadioQ | DateQ | MapQ | InputQ;

type MapAnswer = { name?: string; address?: string; coordinates: { lat: number; lng: number } };
type DateRangeAnswer = { start?: string; end?: string };

type AnswerByKind = {
  radio: string;
  date: DateRangeAnswer;
  map: MapAnswer;
  input: string;
};

type AnyAnswer = AnswerByKind[keyof AnswerByKind];
type Answers = Record<number, AnyAnswer | undefined>;

const QUESTIONS: readonly Question[] = [
  {
    id: 1,
    kind: "radio",
    title: "What type of position are you listing?",
    options: [
      "Captain",
      "First Mate",
      "Deckhand",
      "Engineer",
      "Steward/Stewardess",
      "Chef",
    ] as const,
  },
  {
    id: 2,
    kind: "radio",
    title: "What type of vessel",
    options: [
      "Sailing yacht",
      "Catamaran",
      "Motor yacht",
      "Racing boat",
      "Charter boat",
      "Workboat/Commercial",
    ] as const,
  },
  {
    id: 3,
    kind: "date",
    title: "When should the crew join and disembark?",
    description: "Pick both dates. End cannot be earlier than join.",
  },
  {
    id: 4,
    kind: "map",
    title: "Where will the crew join the vessel?",
  },
  {
    id: 5,
    kind: "input",
    title: "Anything else you’d like to add?",
    description: "(Optional — describe the role, daily duties, or onboard vibe.)",
  },
] as const;

function isDateAnswer(v: AnyAnswer | undefined): v is DateRangeAnswer {
  return !!v && typeof v === "object" && ("start" in v || "end" in v) && !("coordinates" in v);
}
function isMapAnswer(v: AnyAnswer | undefined): v is MapAnswer {
  return !!v && typeof v === "object" && "coordinates" in v;
}

function isAnswered(step: Question, val: AnyAnswer | undefined): boolean {
  switch (step.kind) {
    case "radio":
    case "input":
      return typeof val === "string" && val.trim().length > 0;
    case "date": {
      if (!isDateAnswer(val)) return false;
      const { start, end } = val;
      if (!start || !end) return false;
      return new Date(start) <= new Date(end);
    }
    case "map":
      return isMapAnswer(val);
  }
}

export default function AddListingWizard() {
  const { step } = useParams();
  const navigate = useNavigate();

  const total = QUESTIONS.length;
  const index = Math.max(0, Math.min(total - 1, (Number(step) || 1) - 1));
  const current: Question = QUESTIONS[index];

  const [answers, setAnswers] = useState<Answers>({});

  const setCurrentAnswer = (value: AnyAnswer | undefined) =>
    setAnswers((prev) => ({ ...prev, [current.id]: value }));

  const canNext = isAnswered(current, answers[current.id]);

  const goBack = () => {
    if (index === 0) return;
    navigate(`/add-listing/${index}`);
  };

  const goNext = () => {
    if (!canNext) return;
    if (index < total - 1) navigate(`/add-listing/${index + 2}`);
    else {
      console.log("Submit payload:", answers);
      // navigate("/add-listing/review")
    }
  };

  return (
    <>
      <div className="flex w-full">
        <div className="ml-auto flex gap-2">
          <Button variant="secondary">Questions?</Button>
          <Button
            variant="secondary"
            onClick={() => localStorage.setItem("addListingDraft", JSON.stringify(answers))}
          >
            Save &amp; Exit
          </Button>
        </div>
      </div>

      <div className="h-[calc(100dvh-122px)]">
        <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-xl font-semibold">
              Q{index + 1}. {current.title}
            </div>
            {current.description && (
              <div className="text-muted-foreground text-center text-sm">{current.description}</div>
            )}
          </div>

          <StepRenderer step={current} value={answers[current.id]} onChange={setCurrentAnswer} />
        </div>
      </div>

      <div className="bg-background sticky bottom-0 w-full">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-3">
          <div className="flex w-full items-center gap-1">
            {QUESTIONS.map((q, i) => {
              const answered = isAnswered(q, answers[q.id]);
              const active = i === index;
              return (
                <div
                  key={q.id}
                  className={cn(
                    "h-2 flex-1 rounded",
                    answered ? "bg-primary" : active ? "bg-blue-500" : "bg-muted"
                  )}
                  aria-label={`Step ${i + 1} ${answered ? "completed" : active ? "current" : "pending"}`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="link" onClick={goBack} disabled={index === 0}>
              Back
            </Button>
            <Button onClick={goNext} disabled={!canNext}>
              {index === total - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function StepRenderer({
  step,
  value,
  onChange,
}: {
  step: Question;
  value: AnyAnswer | undefined;
  onChange: (v: AnyAnswer | undefined) => void;
}) {
  switch (step.kind) {
    case "radio":
      return (
        <RadioStep
          step={step}
          value={typeof value === "string" ? value : undefined}
          onChange={onChange}
        />
      );
    case "date":
      return <DateRangeStep value={isDateAnswer(value) ? value : undefined} onChange={onChange} />;
    case "input":
      return (
        <InputStep
          placeholder={step.placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onChange(v || undefined)}
        />
      );
    case "map":
      return <MapStep value={isMapAnswer(value) ? value : undefined} onChange={onChange} />;
  }
}

function RadioStep({
  step,
  value,
  onChange,
}: {
  step: RadioQ;
  value?: string;
  onChange: (v: AnyAnswer | undefined) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2" role="radiogroup" aria-label={step.title}>
      {step.options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(selected ? undefined : option)}
            className={cn(
              "w-full rounded-2xl border-2 py-4 text-center font-medium transition",
              "focus:ring-primary/40 focus:ring-2 focus:outline-none",
              selected ? "border-primary bg-secondary" : "border-border hover:bg-secondary"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function DateRangeStep({
  value,
  onChange,
}: {
  value?: DateRangeAnswer;
  onChange: (v: AnyAnswer | undefined) => void;
}) {
  const start = value?.start ?? "";
  const end = value?.end ?? "";
  const valid = start && end && new Date(start) <= new Date(end);

  return (
    <div className="flex w-full flex-col gap-3" aria-label="Select join and end dates">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="join" className="text-muted-foreground text-xs">
            Join date
          </label>
          <input
            id="join"
            type="date"
            value={start}
            onChange={(e) => onChange({ start: e.target.value || undefined, end })}
            max={end || undefined}
            className="border-border rounded-lg border p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="end" className="text-muted-foreground text-xs">
            End date
          </label>
          <input
            id="end"
            type="date"
            value={end}
            onChange={(e) => onChange({ start, end: e.target.value || undefined })}
            min={start || undefined}
            className="border-border rounded-lg border p-2"
          />
        </div>
      </div>

      <div className={cn("text-xs", valid ? "text-muted-foreground" : "text-destructive")}>
        {start && end
          ? valid
            ? "Dates look good."
            : "End date cannot be earlier than join date."
          : "Select both dates to continue."}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onChange(undefined)}
          disabled={!start && !end}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

function InputStep({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-border min-h-11 rounded-lg border-2 p-2"
      />
      <div className="text-muted-foreground text-xs">
        {value.trim() ? "Looks good." : "Enter a value to continue."}
      </div>
    </div>
  );
}

function MapStep({
  value,
  onChange,
}: {
  value?: MapAnswer;
  onChange: (v: AnyAnswer | undefined) => void;
}) {
  const setMock = () =>
    onChange({
      name: "Copenhagen Marina",
      address: "Refshaleøen",
      coordinates: { lat: 55.691, lng: 12.616 },
    });
  const clear = () => onChange(undefined);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-secondary text-muted-foreground border-border grid h-60 w-full place-items-center rounded-3xl border-2 text-sm">
        Map placeholder
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" onClick={setMock}>
          Set mock location
        </Button>
        <Button type="button" variant="secondary" onClick={clear} disabled={!value}>
          Clear
        </Button>
      </div>
      <div className="text-muted-foreground text-xs">
        {value
          ? `Selected: ${value.coordinates.lat.toFixed(4)}, ${value.coordinates.lng.toFixed(4)}`
          : "Select a location to continue."}
      </div>
    </div>
  );
}
