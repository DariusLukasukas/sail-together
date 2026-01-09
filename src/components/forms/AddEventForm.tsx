import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel, FieldError } from "@/components/ui/field";
import MapWithGeocoder from "@/components/map/MapWithGeocoder";
import type { Location } from "@/types/location";
import { useState, useEffect } from "react";
import { createEvent, updateEvent } from "@/features/events/api";
import { mutate } from "swr";
import DateTimePicker from "./DateTimePicker";
import CategorySelector from "./CategorySelector";
import PriceSelector from "./PriceSelector";
import type { Currency } from "@/types/event";
import type { CategorySlug } from "@/types/category";
import type { EventAttributes } from "@/db/types/Event";
import { Textarea } from "../ui/textarea";

type FormState = {
  title: string;
  description?: string;
  location: Location | null;
  categorySlug: CategorySlug | null;
  startDate: Date;
  endDate?: Date;
  priceKind: "free" | "paid" | null;
  priceAmount?: number;
  priceCurrency?: Currency;
  imageFile?: File | null;
};

const INITIAL_FORM_STATE: FormState = {
  title: "",
  description: undefined,
  location: null,
  categorySlug: null,
  startDate: new Date(),
  endDate: undefined,
  priceKind: null,
  priceAmount: undefined,
  priceCurrency: "DKK",
  imageFile: null,
};

interface AddEventFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  mode?: "create" | "edit";
  event?: EventAttributes;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function AddEventForm({
  className,
  mode = "create",
  event,
  onSuccess,
  onCancel,
  submitLabel,
  ...props
}: AddEventFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize form with event data when in edit mode
  useEffect(() => {
    if (mode === "edit" && event) {
      const location = event.locationId as any;
      setForm({
        title: event.title || "",
        description: event.description || undefined,
        location: location
          ? {
            id: location.id || location.objectId || "",
            name: location.name || "",
            address: location.address || "",
            longitude: location.longitude || 0,
            latitude: location.latitude || 0,
          }
          : null,
        categorySlug: (event.categorySlug as CategorySlug) || null,
        startDate: event.startDate ? new Date(event.startDate) : new Date(),
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        priceKind: (event.priceKind as "free" | "paid") || null,
        priceAmount: event.priceAmount || undefined,
        priceCurrency: (event.priceCurrency as Currency) || "DKK",
        imageFile: null, // Don't pre-populate file input
      });
      // Set image preview to existing image URL
      if (event.imageUrl) {
        setImagePreview(event.imageUrl);
      }
    } else {
      // Reset preview when switching to create mode
      setImagePreview(null);
    }
  }, [mode, event]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setError(null);
    setTouched({});
  };

  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (!form.location) return "Location is required";
    if (!form.categorySlug) return "Category is required";
    if (!form.priceKind) return "Price kind is required";
    if (form.priceKind === "paid" && (!form.priceAmount || form.priceAmount <= 0)) {
      return "Price amount is required for paid events";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setTouched({
      title: true,
      location: true,
      categorySlug: true,
      priceKind: true,
      startDate: true,
      startTime: true,
      priceAmount: true,
    });

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "edit" && event) {
        // Update existing event
        const updateData: Parameters<typeof updateEvent>[1] = {
          title: form.title.trim(),
          description: form.description?.trim() || undefined,
          startDate: form.startDate,
          endDate: form.endDate,
          categorySlug: form.categorySlug!,
          location: {
            name: form.location!.name,
            address: form.location!.address,
            longitude: form.location!.longitude,
            latitude: form.location!.latitude,
          },
          priceKind: form.priceKind!,
          priceAmount: form.priceKind === "paid" ? form.priceAmount : undefined,
          priceCurrency: form.priceKind === "paid" ? form.priceCurrency : undefined,
        };

        // Handle image: if new file provided, use it; otherwise keep existing
        if (form.imageFile) {
          updateData.imageFile = form.imageFile;
        } else if (event.imageUrl) {
          updateData.imageUrl = event.imageUrl;
        }

        await updateEvent(event.id, updateData);

        // Invalidate caches
        await mutate("events");
        await mutate(`event-${event.id}`);
      } else {
        // Create new event
        await createEvent({
          title: form.title.trim(),
          description: form.description?.trim() || undefined,
          startDate: form.startDate,
          endDate: form.endDate,
          categorySlug: form.categorySlug!,
          location: {
            name: form.location!.name,
            address: form.location!.address,
            longitude: form.location!.longitude,
            latitude: form.location!.latitude,
          },
          priceKind: form.priceKind!,
          priceAmount: form.priceKind === "paid" ? form.priceAmount : undefined,
          priceCurrency: form.priceKind === "paid" ? form.priceCurrency : undefined,
          imageFile: form.imageFile || undefined,
        });

        // Invalidate and refetch events cache
        await mutate("events");
        resetForm();
      }

      onSuccess?.();
    } catch (err: any) {
      setError(
        err instanceof Error
          ? err.message
          : mode === "edit"
            ? "Failed to update event"
            : "Failed to create event"
      );
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} event:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={cn("flex w-full flex-col gap-8 py-4", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <Field>
        <FieldLabel htmlFor="title">What do you want to call this event?</FieldLabel>
        <Input
          id="title"
          type="text"
          placeholder="e.g. Evening sail, Marina party"
          required
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">What should people know about this event?</FieldLabel>
        <FieldDescription>
          Tell people what's planned. Include details about the vibe, the route, skill level, or
          anything they should know before joining.
        </FieldDescription>
        <Textarea
          id="description"
          placeholder="Describe the event..."
          value={form.description || ""}
          onChange={(e) => updateField("description", e.target.value || undefined)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="place">Where is your event taking place?</FieldLabel>
        <FieldDescription>
          Add the marina, harbor, or meeting point so sailors can find it on the map.
        </FieldDescription>

        <MapWithGeocoder
          value={
            form.location
              ? {
                name: form.location.name,
                address: form.location.address,
                longitude: form.location.longitude,
                latitude: form.location.latitude,
              }
              : null
          }
          onLocationSelect={(locationData) => updateField("location", { id: "", ...locationData })}
        />

        {!form.location && (
          <FieldError errors={[{ message: "Please select a location on the map" }]} />
        )}
      </Field>

      <CategorySelector
        value={form.categorySlug}
        onChange={(value) => updateField("categorySlug", value)}
      />

      <DateTimePicker
        label="When does your event start?"
        dateValue={form.startDate}
        timeValue={form.startDate}
        onDateChange={(date) => updateField("startDate", date || form.startDate)}
        onTimeChange={(date) => updateField("startDate", date || form.startDate)}
        dateId="startDate"
        timeId="startTime"
        required
        touched={touched.startDate || touched.startTime}
      />

      <DateTimePicker
        label="When does your event end? (Optional)"
        dateValue={form.endDate}
        timeValue={form.endDate}
        onDateChange={(date) => updateField("endDate", date || undefined)}
        onTimeChange={(date) => updateField("endDate", date || undefined)}
        dateId="endDate"
        timeId="endTime"
      />

      <PriceSelector
        priceKind={form.priceKind}
        priceAmount={form.priceAmount}
        priceCurrency={form.priceCurrency}
        onPriceKindChange={(kind) => updateField("priceKind", kind)}
        onPriceAmountChange={(amount) => updateField("priceAmount", amount)}
        onCurrencyChange={(currency) => updateField("priceCurrency", currency)}
        touched={touched.priceAmount}
      />

      <Field>
        <FieldLabel htmlFor="image">Add a few photos of your event (Optional)</FieldLabel>
        <FieldDescription>
          A few images of the boat or location make your listing stand out. You can add more or make
          changes later.
        </FieldDescription>

        {/* Image Preview */}
        {(imagePreview || form.imageFile) && (
          <div className="mb-4">
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-border">
              {form.imageFile ? (
                // Show preview of new file
                <img
                  src={URL.createObjectURL(form.imageFile)}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : imagePreview ? (
                // Show existing image
                <img
                  src={imagePreview}
                  alt="Current event image"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            {mode === "edit" && event?.imageUrl && !form.imageFile && (
              <p className="mt-2 text-sm text-muted-foreground">Current image</p>
            )}
            {form.imageFile && (
              <p className="mt-2 text-sm text-muted-foreground">
                New image selected: {form.imageFile.name}
              </p>
            )}
          </div>
        )}

        <Input
          id="image"
          type="file"
          accept="image/png, image/jpeg"
          className="border-2 border-dashed"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            updateField("imageFile", file);
            // Update preview with new file
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            } else {
              // Reset to existing image if clearing file selection
              setImagePreview(mode === "edit" && event?.imageUrl ? event.imageUrl : null);
            }
          }}
        />
        {mode === "edit" && event?.imageUrl && !form.imageFile && (
          <p className="mt-2 text-sm text-muted-foreground">
            Select a new image to replace the current one, or leave empty to keep the existing image.
          </p>
        )}
      </Field>

      {error && (
        <div
          role="alert"
          className="bg-destructive/10 text-destructive border-destructive/20 rounded-xl border px-3 py-2 text-center text-sm font-medium"
        >
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          size="lg"
          className="flex-1"
          variant="secondary"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              resetForm();
            }
          }}
        >
          Cancel
        </Button>

        <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : submitLabel || (mode === "edit" ? "Update Event" : "Create")}
        </Button>
      </div>
    </form>
  );
}
