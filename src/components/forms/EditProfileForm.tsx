import { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useProfile } from "@/contexts/profile_context";
import Parse from "@/lib/parse/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ABOUT_LENGTH = 500;
const MAX_SKILLS = 20;
const MAX_SKILL_LENGTH = 50;

type EditProfileFormProps = React.ComponentProps<"form"> & {
  onCancel?: () => void;
  onSaved?: () => void;
};

export default function EditProfileForm({
  className,
  onCancel,
  onSaved,
  ...props
}: EditProfileFormProps) {
  const { profile, updateProfile } = useProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatarUrl || "");
      setLocation(profile.location || "");
      setAbout(profile.about || "");
      setSkillsInput(profile.skills?.join(", ") || "");
    }
  }, [profile]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Form validation
  const isFormValid = useMemo(() => {
    return name.trim().length > 0 && name.trim().length <= 100;
  }, [name]);

  const hasChanges = useMemo(() => {
    if (!profile) return false;
    return (
      name !== (profile.name || "") ||
      phone !== (profile.phone || "") ||
      location !== (profile.location || "") ||
      about !== (profile.about || "") ||
      skillsInput !== (profile.skills?.join(", ") || "") ||
      selectedFile !== null
    );
  }, [profile, name, phone, location, about, skillsInput, selectedFile]);

  // Avatar display
  const displayAvatarUrl = previewUrl || avatarUrl || undefined;
  const displayName = name.trim() || profile?.name || profile?.username || "";
  
  const avatarInitials = useMemo(() => {
    return displayName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  }, [displayName]);

  // Character counts
  const aboutCharCount = about.length;
  const aboutRemaining = MAX_ABOUT_LENGTH - aboutCharCount;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Parse and validate skills
      const skillsArray = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length <= MAX_SKILL_LENGTH)
        .slice(0, MAX_SKILLS);

      let finalAvatarUrl = avatarUrl.trim() || undefined;

      // Upload file if selected
      if (selectedFile) {
        setUploadProgress(10);
        const parseFile = new Parse.File(selectedFile.name, selectedFile);
        
        await parseFile.save({
          progress: (progressValue: number) => {
            setUploadProgress(Math.round(progressValue * 100));
          }
        });
        
        finalAvatarUrl = parseFile.url() || finalAvatarUrl;
        setUploadProgress(100);
      }

      // Update profile
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
        avatarUrl: finalAvatarUrl,
        location: location.trim() || undefined,
        about: about.trim() || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
      });

      // Clear file selection
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setUploadProgress(0);

      setSuccess("Profile updated successfully!");

      // Call callback immediately
      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      
      let message = "Failed to update profile";
      if (err instanceof Error) {
        if (err.message.includes("network")) {
          message = "Network error. Please check your connection and try again.";
        } else if (err.message.includes("permission")) {
          message = "You don't have permission to update this profile.";
        } else {
          message = err.message;
        }
      }
      
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancelClick() {
    // Reset to original values
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatarUrl || "");
      setLocation(profile.location || "");
      setAbout(profile.about || "");
      setSkillsInput(profile.skills?.join(", ") || "");
    }
    
    // Clear file selection
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    setError("");
    setSuccess("");
    setUploadProgress(0);

    onCancel?.();
  }

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, GIF, etc.)");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    setError("");

    // Create preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  if (!profile) {
    return (
      <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-center">
        Failed to load profile. Please try again.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6 py-4", className)} {...props}>
      {/* Avatar Upload */}
      <Field>
        <FieldLabel>Profile Picture</FieldLabel>
        <FieldDescription>
          Click on the avatar to upload a new image (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
        </FieldDescription>
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="relative group cursor-pointer"
            aria-label="Change profile picture"
          >
            <Avatar className="size-24 rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors">
              <AvatarImage src={displayAvatarUrl} alt="Profile avatar" />
              <AvatarFallback className="bg-[#FFC7D6] text-lg font-semibold">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </button>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full max-w-xs">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-center mt-1 text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Profile picture file input"
          />
        </div>
      </Field>

      {/* Name */}
      <Field>
        <FieldLabel htmlFor="name">Full Name *</FieldLabel>
        <FieldDescription>Your display name on the platform</FieldDescription>
        <Input
          id="name"
          type="text"
          required
          placeholder="Jack Sparrow"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />
      </Field>

      {/* Username (Read-only) */}
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <FieldDescription>Your username cannot be changed</FieldDescription>
        <Input 
          id="username" 
          type="text" 
          value={profile.username} 
          disabled 
          className="bg-muted cursor-not-allowed" 
        />
      </Field>

      {/* Email (Read-only) */}
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldDescription>To change your email, contact support</FieldDescription>
        <Input 
          id="email" 
          type="email" 
          value={profile.email} 
          disabled 
          className="bg-muted cursor-not-allowed" 
        />
      </Field>

      {/* Phone */}
      <Field>
        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
        <FieldDescription>Your contact phone number</FieldDescription>
        <Input
          id="phone"
          type="tel"
          placeholder="+45 12 34 56 78"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={20}
        />
      </Field>

      {/* Location */}
      <Field>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <FieldDescription>Where are you based?</FieldDescription>
        <Input
          id="location"
          type="text"
          placeholder="Copenhagen, Denmark"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          maxLength={100}
        />
      </Field>

      {/* About */}
      <Field>
        <FieldLabel htmlFor="about">About</FieldLabel>
        <FieldDescription>
          Tell us about yourself and your experience ({aboutRemaining} characters remaining)
        </FieldDescription>
        <textarea
          id="about"
          placeholder="Brief bio or description..."
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          maxLength={MAX_ABOUT_LENGTH}
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:ring-ring min-h-32 w-full rounded-md border px-3 py-2 text-sm",
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            aboutRemaining < 50 && "border-orange-300"
          )}
        />
        {aboutRemaining < 50 && (
          <p className="text-xs text-orange-600 mt-1">
            {aboutRemaining} characters remaining
          </p>
        )}
      </Field>

      {/* Skills */}
      <Field>
        <FieldLabel htmlFor="skills">Skills</FieldLabel>
        <FieldDescription>
          Enter up to {MAX_SKILLS} skills separated by commas (e.g., Navigation, Engineering, Fishing)
        </FieldDescription>
        <Input
          id="skills"
          type="text"
          placeholder="Navigation, Engineering, Fishing"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
        />
        {skillsInput && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skillsInput
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .slice(0, MAX_SKILLS)
              .map((skill, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium",
                    skill.length > MAX_SKILL_LENGTH && "bg-red-100 text-red-600"
                  )}
                >
                  {skill.length > MAX_SKILL_LENGTH ? `${skill.slice(0, 20)}... (too long)` : skill}
                </span>
              ))}
          </div>
        )}
      </Field>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-destructive/10 text-destructive border-destructive/20 w-full rounded-xl border px-3 py-2 text-center text-sm font-medium"
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          role="alert"
          aria-live="polite"
          className="w-full rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700"
        >
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="flex-1"
          onClick={handleCancelClick}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button 
          type="submit" 
          size="lg" 
          className="flex-1" 
          disabled={!isFormValid || !hasChanges || isSubmitting}
        >
          {isSubmitting && <Spinner className="mr-2" />}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}