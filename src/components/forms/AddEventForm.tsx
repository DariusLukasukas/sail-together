import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { EVENT_TYPES } from "../searchbar/SearchEvent";
import { Button } from "../ui/button";
import MapWithGeocoder from "../map/MapWithGeocoder";
import { useState } from "react";
import { createEvent, createLocation } from "@/features/events/api";
import { Spinner } from "../ui/spinner";
import type { CategorySlug } from "@/types/category";
import type { Currency } from "@/types/event";
import { getCurrentUser } from "@/lib/parse/auth";

interface LocationData {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

export default function AddEventForm({ className, ...props }: React.ComponentProps<"form">) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [category, setCategory] = useState<CategorySlug | null>(null);
  const [priceKind, setPriceKind] = useState<"free" | "paid" | null>(null);
  const [priceAmount, setPriceAmount] = useState("");
  const [priceCurrency, setPriceCurrency] = useState<Currency>("DKK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation
  const hasTitle = title.trim().length > 0;
  const hasLocation = location !== null;
  const hasCategory = category !== null;
  const hasPriceKind = priceKind !== null;
  const hasStartDate = startDate !== "";
  const isValidPriceAmount =
    priceKind === "free" || (priceKind === "paid" && priceAmount && parseFloat(priceAmount) > 0);

  const isFormValid =
    hasTitle && hasLocation && hasCategory && hasPriceKind && hasStartDate && isValidPriceAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError("You must be logged in to create an event");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Create location first
      if (!location) {
        throw new Error("Location is required");
      }

      const locationObj = await createLocation({
        name: location.name,
        address: location.address,
        longitude: location.longitude,
        latitude: location.latitude,
      });

      // Create event
      if (!category) {
        throw new Error("Category is required");
      }

      if (!priceKind) {
        throw new Error("Price kind is required");
      }

      const startDateObj = new Date(startDate);
      const endDateObj = endDate ? new Date(endDate) : undefined;

      await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        startDate: startDateObj,
        endDate: endDateObj,
        categorySlug: category,
        locationId: locationObj.id,
        priceKind,
        priceAmount: priceKind === "paid" && priceAmount ? parseFloat(priceAmount) : undefined,
        priceCurrency: priceKind === "paid" ? priceCurrency : undefined,
      });

      // TODO: Handle image upload when schema is updated
      if (imageFile) {
        console.log("Image upload will be handled later:", imageFile.name);
      }

      setSuccess("Event created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setLocation(null);
      setCategory(null);
      setPriceKind(null);
      setPriceAmount("");
      setPriceCurrency("DKK");
      setStartDate("");
      setEndDate("");
      setImageFile(null);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Failed to create event";
      setError(message);
      console.error("Error creating event:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-8 py-4", className)} {...props}>
      <Field>
        <FieldLabel htmlFor="title">What do you want to call this event?</FieldLabel>
        <Input
          id="title"
          type="text"
          placeholder="e.g. Evening sail, Marina party"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="place">Where is your event taking place?</FieldLabel>
        <FieldDescription>
          Add the marina, harbor, or meeting point so sailors can find it on the map.
        </FieldDescription>
        <MapWithGeocoder onLocationSelect={(loc) => setLocation(loc)} value={location} />
        {!hasLocation && (
          <FieldError errors={[{ message: "Please select a location on the map" }]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="category">What type of event are you hosting?</FieldLabel>
        <Input id="category" type="hidden" value={category || ""} />
        <div className="grid grid-cols-3 gap-4">
          {EVENT_TYPES.map((event) => (
            <Button
              key={event.id}
              type="button"
              variant={category === event.id ? "default" : "outline"}
              className="py-8"
              onClick={() => setCategory(event.id)}
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
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
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
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || undefined}
        />
      </Field>

      <Field>
        <FieldLabel>What's the pricing for your event?</FieldLabel>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={priceKind === "paid" ? "default" : "outline"}
            className="py-8"
            onClick={() => {
              setPriceKind("paid");
              setPriceAmount("");
            }}
          >
            Paid
          </Button>
          <Button
            type="button"
            variant={priceKind === "free" ? "default" : "outline"}
            className="py-8"
            onClick={() => {
              setPriceKind("free");
              setPriceAmount("");
            }}
          >
            Free
          </Button>
        </div>
        {!hasPriceKind && <FieldError errors={[{ message: "Please select pricing type" }]} />}
      </Field>

      {priceKind === "paid" && (
        <>
          <Field>
            <FieldLabel htmlFor="priceAmount">Price Amount</FieldLabel>
            <Input
              id="priceAmount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              required={priceKind === "paid"}
            />
            {priceKind === "paid" && !isValidPriceAmount && (
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
              value={priceCurrency}
              onChange={(e) => setPriceCurrency(e.target.value as Currency)}
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
            setImageFile(file);
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
        <Button
          type="button"
          size={"lg"}
          variant={"secondary"}
          className="flex-1"
          onClick={() => {
            setTitle("");
            setDescription("");
            setLocation(null);
            setCategory(null);
            setPriceKind(null);
            setPriceAmount("");
            setPriceCurrency("DKK");
            setStartDate("");
            setEndDate("");
            setImageFile(null);
            setError("");
            setSuccess("");
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          size={"lg"}
          className="flex-1"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting && <Spinner />}
          Create
        </Button>
      </div>
    </form>
  );
}
