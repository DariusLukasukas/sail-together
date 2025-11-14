import { useState } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { EVENT_TYPES } from "../searchbar/SearchEvent";
import { Button } from "../ui/button";
import MapWithGeocoder from "../map/MapWithGeocoder";
import { Spinner } from "../ui/spinner";
import { createEvent } from "@/features/events/api";
import { getCurrentUser } from "@/lib/parse/auth";
import type { CategorySlug } from "@/types/category";
import type { Currency } from "@/types/event";

interface LocationData {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

interface AddEventFormProps {
  onSuccess?: () => void;
}

type EventFormState = {
  title: string;
  description: string;
  location: LocationData | null;
  category: CategorySlug | null;
  priceKind: "free" | "paid" | null;
  priceAmount: string;
  priceCurrency: Currency;
  startDate: string;
  endDate: string;
  imageFile: File | null;
};

const INITIAL_FORM_STATE: EventFormState = {
  title: "",
  description: "",
  location: null,
  category: null,
  priceKind: null,
  priceAmount: "",
  priceCurrency: "DKK",
  startDate: "",
  endDate: "",
  imageFile: null,
};

export default function AddEventForm({
  className,
  onSuccess,
  ...props
}: React.ComponentProps<"form"> & AddEventFormProps) {
  const [form, setForm] = useState<EventFormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update<Key extends keyof EventFormState>(key: Key, value: EventFormState[Key]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm(INITIAL_FORM_STATE);
    setError("");
    setSuccess("");
  }

  // Validation
  const hasTitle = form.title.trim().length > 0;
  const hasLocation = form.location !== null;
  const hasCategory = form.category !== null;
  const hasPriceKind = form.priceKind !== null;
  const hasStartDate = form.startDate !== "";
  const isValidPriceAmount =
    form.priceKind === "free" ||
    (form.priceKind === "paid" && form.priceAmount && parseFloat(form.priceAmount) > 0);

  const isFormValid =
    hasTitle && hasLocation && hasCategory && hasPriceKind && hasStartDate && isValidPriceAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError("You must be logged in to create an event");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (!form.location) {
        throw new Error("Location is required");
      }
      if (!form.category) {
        throw new Error("Category is required");
      }
      if (!form.priceKind) {
        throw new Error("Price kind is required");
      }

      const startDateObj = new Date(form.startDate);
      const endDateObj = form.endDate ? new Date(form.endDate) : undefined;

      await createEvent({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        startDate: startDateObj,
        endDate: endDateObj,
        categorySlug: form.category,
        location: form.location,
        priceKind: form.priceKind,
        priceAmount:
          form.priceKind === "paid" && form.priceAmount ? parseFloat(form.priceAmount) : undefined,
        priceCurrency: form.priceKind === "paid" ? form.priceCurrency : undefined,
      });

      if (form.imageFile) {
        console.log("Image upload will be handled later:", form.imageFile.name);
      }

      setSuccess("Event created successfully!");
      setError("");
      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Failed to create event";
      setError(message);
      setSuccess("");
      console.error("Error creating event:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full flex-col gap-8 py-4", className)}
      {...props}
    >
      <Field>
        <FieldLabel htmlFor="title">What do you want to call this event?</FieldLabel>
        <Input
          id="title"
          type="text"
          placeholder="e.g. Evening sail, Marina party"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">What should people know about this event?</FieldLabel>
        <FieldDescription>
          Tell people what's planned. Include details about the vibe, the route, skill level, or
          anything they should know before joining.
        </FieldDescription>
        <Input
          id="description"
          type="text"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="place">Where is your event taking place?</FieldLabel>
        <FieldDescription>
          Add the marina, harbor, or meeting point so sailors can find it on the map.
        </FieldDescription>

        <MapWithGeocoder
          onLocationSelect={(loc) => update("location", loc)}
          value={form.location}
        />

        {!hasLocation && (
          <FieldError errors={[{ message: "Please select a location on the map" }]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="category">What type of event are you hosting?</FieldLabel>
        <Input id="category" type="hidden" value={form.category || ""} />
        <div className="grid grid-cols-3 gap-4">
          {EVENT_TYPES.map((event) => (
            <Button
              key={event.id}
              type="button"
              variant={form.category === event.id ? "default" : "outline"}
              className="py-8"
              onClick={() => update("category", event.id as CategorySlug)}
            >
              {event.label}
            </Button>
          ))}
        </div>
        {!hasCategory && <FieldError errors={[{ message: "Please select an event type" }]} />}
      </Field>

      <Field>
        <FieldLabel htmlFor="startDate">When does your event start?</FieldLabel>
        <FieldDescription>Select the start date and time for your event.</FieldDescription>
        <Input
          id="startDate"
          type="datetime-local"
          value={form.startDate}
          onChange={(e) => update("startDate", e.target.value)}
          required
        />
        {!hasStartDate && <FieldError errors={[{ message: "Start date is required" }]} />}
      </Field>

      <Field>
        <FieldLabel htmlFor="endDate">When does your event end? (Optional)</FieldLabel>
        <FieldDescription>
          Select the end date and time if your event spans multiple days.
        </FieldDescription>
        <Input
          id="endDate"
          type="datetime-local"
          value={form.endDate}
          onChange={(e) => update("endDate", e.target.value)}
          min={form.startDate || undefined}
        />
      </Field>

      <Field>
        <FieldLabel>What's the pricing for your event?</FieldLabel>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={form.priceKind === "paid" ? "default" : "outline"}
            className="py-8"
            onClick={() => {
              update("priceKind", "paid");
              update("priceAmount", "");
            }}
          >
            Paid
          </Button>
          <Button
            type="button"
            variant={form.priceKind === "free" ? "default" : "outline"}
            className="py-8"
            onClick={() => {
              update("priceKind", "free");
              update("priceAmount", "");
            }}
          >
            Free
          </Button>
        </div>
        {!hasPriceKind && <FieldError errors={[{ message: "Please select pricing type" }]} />}
      </Field>

      {form.priceKind === "paid" && (
        <>
          <Field>
            <FieldLabel htmlFor="priceAmount">Price Amount</FieldLabel>
            <Input
              id="priceAmount"
              type="number"
              step="1"
              min="1"
              placeholder="1"
              value={form.priceAmount}
              onChange={(e) => update("priceAmount", e.target.value)}
              required
            />
            {form.priceKind === "paid" && !isValidPriceAmount && (
              <FieldError errors={[{ message: "Please enter a valid price amount" }]} />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="priceCurrency">Currency</FieldLabel>
            <select
              id="priceCurrency"
              className={cn(
                "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                "placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
              value={form.priceCurrency}
              onChange={(e) => update("priceCurrency", e.target.value as Currency)}
            >
              <option value="DKK">DKK</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </Field>
        </>
      )}

      <Field>
        <FieldLabel htmlFor="image">Add a few photos of your event (Optional)</FieldLabel>
        <FieldDescription>
          A few images of the boat or location make your listing stand out. You can add more or make
          changes later.
        </FieldDescription>
        <Input
          id="image"
          type="file"
          accept="image/png, image/jpeg"
          className="border-2 border-dashed"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            update("imageFile", file);
          }}
        />
      </Field>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-destructive/10 text-destructive border-destructive/20 w-full rounded-xl border px-3 py-2 text-center text-sm font-medium"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="alert"
          aria-live="polite"
          className="w-full rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700"
        >
          {success}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" size="lg" className="flex-1" variant="secondary" onClick={resetForm}>
          Cancel
        </Button>

        <Button type="submit" size="lg" className="flex-1" disabled={!isFormValid || isSubmitting}>
          {isSubmitting && <Spinner />}
          Create
        </Button>
      </div>
    </form>
  );
}
