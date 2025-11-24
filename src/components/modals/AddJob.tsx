import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MapWithGeocoder from "../map/MapWithGeocoder";
import { createJob } from "@/features/jobs/api";
import { Spinner } from "../ui/spinner";
import type { JobType } from "@/types/job";
import { getCurrentUser } from "@/lib/parse/auth";
import { mutate } from "swr";

interface LocationData {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
}

const JOB_TYPES: Array<{ id: JobType; label: string }> = [
    { id: "Permanent", label: "Permanent" },
    { id: "Contract", label: "Contract" },
    { id: "Seasonal", label: "Seasonal" },
    { id: "Temporary", label: "Temporary" },
];

const POSITIONS = [
    "Captain",
    "First Mate",
    "Deckhand",
    "Engineer",
    "Steward/Stewardess",
    "Chef",
] as const;

const VESSEL_TYPES = [
    "Sailing yacht",
    "Catamaran",
    "Motor yacht",
    "Racing boat",
    "Charter boat",
    "Workboat/Commercial",
] as const;

type FormState = {
    title: string;
    vessel: string;
    description?: string;
    location: LocationData | null;
    jobType: JobType | null;
    startDate: Date;
    endDate?: Date;
    requirements: string[];
    experience: string[];
    qualifications: string[];
    imageFile: File | null;
};

const INITIAL_FORM_STATE: FormState = {
    title: "",
    vessel: "",
    description: undefined,
    location: null,
    jobType: null,
    startDate: new Date(),
    endDate: undefined,
    requirements: [""],
    experience: [""],
    qualifications: [""],
    imageFile: null,
};

export default function AddJob() {
    const navigate = useNavigate();
    const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const markTouched = (fieldName: string) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
    };

    const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];

    const resetForm = () => {
        setForm(INITIAL_FORM_STATE);
        setError(null);
        setTouched({});
    };

    const addListItem = (key: "requirements" | "experience" | "qualifications") => {
        updateField(key, [...form[key], ""]);
    };

    const updateListItem = (
        key: "requirements" | "experience" | "qualifications",
        index: number,
        value: string
    ) => {
        const newList = form[key].map((item, i) => (i === index ? value : item));
        updateField(key, newList);
    };

    const removeListItem = (key: "requirements" | "experience" | "qualifications", index: number) => {
        if (form[key].length === 1) return;
        const newList = form[key].filter((_, i) => i !== index);
        updateField(key, newList);
    };

    const validateForm = (): string | null => {
        if (!form.title.trim()) return "Please select a position";
        if (!form.vessel.trim()) return "Please select a vessel type";
        if (!form.location) return "Please select a location on the map";
        if (!form.jobType) return "Please select a job type";
        if (!form.startDate) return "Start date is required";
        if (form.endDate && form.startDate > form.endDate) {
            return "End date cannot be earlier than start date";
        }
        return null;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setTouched({
            title: true,
            vessel: true,
            location: true,
            jobType: true,
            startDate: true,
        });

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) {
            setError("You must be logged in to create a job");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await createJob({
                title: form.title.trim(),
                type: form.jobType!,
                date: form.startDate,
                vessel: form.vessel.trim(),
                description: form.description?.trim() || undefined,
                location: {
                    name: form.location!.name,
                    address: form.location!.address,
                    longitude: form.location!.longitude,
                    latitude: form.location!.latitude,
                },
                isFavorite: false,
                imageFile: form.imageFile || undefined,
                requirements: form.requirements.filter((r) => r.trim()),
                experience: form.experience.filter((e) => e.trim()),
                qualifications: form.qualifications.filter((q) => q.trim()),
            });

            // Trigger SWR to refetch jobs
            await mutate("jobs");

            resetForm();
            navigate("/");
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to create job";
            setError(message);
            console.error("Error creating job:", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleClose = () => {
        resetForm();
        navigate("/");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b bg-white px-6 py-4">
                    <h2 className="text-xl font-semibold">Create a New Job</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="rounded-full"
                    >
                        ✕
                    </Button>
                </div>

                {/* Form - Now scrollable */}
                <div className="overflow-y-auto rounded-b-lg">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
                        <Field>
                            <FieldLabel htmlFor="title">Position *</FieldLabel>
                            <FieldDescription>Select the role you're looking to fill.</FieldDescription>
                            <select
                                id="title"
                                className={cn(
                                    "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                                    "placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none"
                                )}
                                value={form.title}
                                onChange={(e) => {
                                    markTouched("title");
                                    updateField("title", e.target.value);
                                }}
                                required
                            >
                                <option value="">Select a position</option>
                                {POSITIONS.map((pos) => (
                                    <option key={pos} value={pos}>{pos}</option>
                                ))}
                            </select>
                            {touched.title && !form.title && (
                                <FieldError errors={[{ message: "Please select a position" }]} />
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="vessel">Vessel Type *</FieldLabel>
                            <select
                                id="vessel"
                                className={cn(
                                    "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                                    "placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none"
                                )}
                                value={form.vessel}
                                onChange={(e) => {
                                    markTouched("vessel");
                                    updateField("vessel", e.target.value);
                                }}
                                required
                            >
                                <option value="">Select vessel type</option>
                                {VESSEL_TYPES.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                            {touched.vessel && !form.vessel && (
                                <FieldError errors={[{ message: "Please select a vessel type" }]} />
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Job Type *</FieldLabel>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {JOB_TYPES.map((type) => (
                                    <Button
                                        key={type.id}
                                        type="button"
                                        variant={form.jobType === type.id ? "default" : "outline"}
                                        className="py-8"
                                        onClick={() => {
                                            markTouched("jobType");
                                            updateField("jobType", type.id);
                                        }}
                                    >
                                        {type.label}
                                    </Button>
                                ))}
                            </div>
                            {touched.jobType && !form.jobType && (
                                <FieldError errors={[{ message: "Please select a job type" }]} />
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <textarea
                                id="description"
                                className={cn(
                                    "border-input flex min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs",
                                    "placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none"
                                )}
                                placeholder="Describe the role..."
                                value={form.description || ""}
                                onChange={(e) => updateField("description", e.target.value || undefined)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Location *</FieldLabel>
                            <FieldDescription>Select where crew will join the vessel.</FieldDescription>
                            <MapWithGeocoder
                                onLocationSelect={(loc) => {
                                    markTouched("location");
                                    updateField("location", loc);
                                }}
                                value={form.location}
                            />
                            {touched.location && !form.location && (
                                <FieldError errors={[{ message: "Please select a location" }]} />
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="startDate">Join Date *</FieldLabel>
                            <Input
                                id="startDate"
                                type="date"
                                value={formatDateForInput(form.startDate)}
                                onChange={(e) => {
                                    markTouched("startDate");
                                    updateField("startDate", new Date(e.target.value));
                                }}
                                required
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="endDate">End Date (Optional)</FieldLabel>
                            <Input
                                id="endDate"
                                type="date"
                                value={form.endDate ? formatDateForInput(form.endDate) : ""}
                                onChange={(e) => {
                                    updateField("endDate", e.target.value ? new Date(e.target.value) : undefined);
                                }}
                                min={formatDateForInput(form.startDate)}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Requirements (Optional)</FieldLabel>
                            {form.requirements.map((req, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g. STCW, ENG1"
                                        value={req}
                                        onChange={(e) => updateListItem("requirements", index, e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => removeListItem("requirements", index)}
                                        disabled={form.requirements.length === 1}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addListItem("requirements")}>
                                Add requirement
                            </Button>
                        </Field>

                        <Field>
                            <FieldLabel>Experience (Optional)</FieldLabel>
                            {form.experience.map((exp, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g. 3+ years on yachts"
                                        value={exp}
                                        onChange={(e) => updateListItem("experience", index, e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => removeListItem("experience", index)}
                                        disabled={form.experience.length === 1}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addListItem("experience")}>
                                Add experience
                            </Button>
                        </Field>

                        <Field>
                            <FieldLabel>Qualifications (Optional)</FieldLabel>
                            {form.qualifications.map((qual, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g. Food hygiene"
                                        value={qual}
                                        onChange={(e) => updateListItem("qualifications", index, e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => removeListItem("qualifications", index)}
                                        disabled={form.qualifications.length === 1}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => addListItem("qualifications")}>
                                Add qualification
                            </Button>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="image">Vessel Photo (Optional)</FieldLabel>
                            <Input
                                id="image"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                className="border-2 border-dashed"
                                onChange={(e) => updateField("imageFile", e.target.files?.[0] || null)}
                            />
                            {form.imageFile && (
                                <p className="text-sm text-muted-foreground">Selected: {form.imageFile.name}</p>
                            )}
                        </Field>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="lg"
                                variant="secondary"
                                className="flex-1"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                                {isSubmitting && <Spinner />}
                                Create Job
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}