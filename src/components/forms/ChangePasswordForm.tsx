import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useProfile } from "@/contexts/profile_context";
import { Eye, EyeOff, Check, X } from "lucide-react";

const MIN_PASSWORD_LENGTH = 8;

// Password validation rules
const passwordRules = [
  {
    id: "length",
    label: `At least ${MIN_PASSWORD_LENGTH} characters`,
    test: (password: string) => password.length >= MIN_PASSWORD_LENGTH,
    required: true,
  },
  {
    id: "uppercase",
    label: "Contains uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
    required: false,
  },
  {
    id: "lowercase",
    label: "Contains lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
    required: false,
  },
  {
    id: "number",
    label: "Contains number",
    test: (password: string) => /[0-9]/.test(password),
    required: false,
  },
  {
    id: "special",
    label: "Contains special character",
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    required: false,
  },
];

// Password Strength Component
type PasswordStrengthProps = {
  password: string;
};

function PasswordStrength({ password }: PasswordStrengthProps) {
  if (password.length === 0) return null;

  const passedRules = passwordRules.filter((rule) => rule.test(password));
  const strength = (passedRules.length / passwordRules.length) * 100;

  const getStrengthLabel = () => {
    if (strength < 40) return { label: "Weak", color: "text-red-600 bg-red-100" };
    if (strength < 60) return { label: "Fair", color: "text-orange-600 bg-orange-100" };
    if (strength < 80) return { label: "Good", color: "text-yellow-600 bg-yellow-100" };
    return { label: "Strong", color: "text-green-600 bg-green-100" };
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">Password Strength:</span>
        <span className={cn("text-xs font-semibold px-2 py-1 rounded", strengthInfo.color)}>
          {strengthInfo.label}
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            strength < 40 && "bg-red-500",
            strength >= 40 && strength < 60 && "bg-orange-500",
            strength >= 60 && strength < 80 && "bg-yellow-500",
            strength >= 80 && "bg-green-500"
          )}
          style={{ width: `${strength}%` }}
        />
      </div>

      <div className="space-y-1">
        {passwordRules.map((rule) => {
          const passed = rule.test(password);
          return (
            <div
              key={rule.id}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                passed ? "text-green-600" : "text-gray-400"
              )}
            >
              {passed ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {rule.label}
              {rule.required && <span className="text-red-500">*</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Notification Component
type NotificationProps = {
  type: "error" | "success" | "warning";
  message: string;
};

function Notification({ type, message }: NotificationProps) {
  if (!message) return null;

  const styles = {
    error: "bg-destructive/10 text-destructive border-destructive/20",
    success: "border-green-200 bg-green-50 text-green-700",
    warning: "border-orange-200 bg-orange-50 text-orange-700",
  };

  return (
    <div
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
      className={cn(
        "w-full rounded-xl border px-3 py-2 text-center text-sm font-medium",
        styles[type]
      )}
    >
      {message}
    </div>
  );
}

// Main Form Component
type ChangePasswordFormProps = React.ComponentProps<"form"> & {
  onCancel?: () => void;
  onChanged?: () => void;
};

export default function ChangePasswordForm({
  className,
  onCancel,
  onChanged,
  ...props
}: ChangePasswordFormProps) {
  const { updatePassword } = useProfile();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const isStrongPassword = useMemo(() => {
    const requiredRules = passwordRules.filter((rule) => rule.required);
    return requiredRules.every((rule) => rule.test(newPassword));
  }, [newPassword]);

  const passwordsMatch = useMemo(() => {
    return newPassword === confirmPassword && confirmPassword.length > 0;
  }, [newPassword, confirmPassword]);

  const isFormValid = useMemo(() => {
    return (
      currentPassword.length > 0 &&
      isStrongPassword &&
      passwordsMatch
    );
  }, [currentPassword, isStrongPassword, passwordsMatch]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // Validate passwords match (redundant but safe)
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      // Validate new password is different
      if (currentPassword === newPassword) {
        throw new Error("New password must be different from current password");
      }

      // Validate password strength
      if (!isStrongPassword) {
        throw new Error(`New password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      }

      await updatePassword(currentPassword, newPassword);

      setSuccess("Password changed successfully! You may need to log in again on other devices.");

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Call callback immediately
      if (onChanged) {
        onChanged();
      }
    } catch (err) {
      console.error("Error changing password:", err);
      
      let message = "Failed to change password";
      if (err instanceof Error) {
        if (err.message.includes("incorrect") || err.message.includes("Invalid")) {
          message = "Current password is incorrect. Please try again.";
        } else if (err.message.includes("network")) {
          message = "Network error. Please check your connection and try again.";
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
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");

    onCancel?.();
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6 py-4", className)} {...props}>
      {/* Current Password */}
      <Field>
        <FieldLabel htmlFor="currentPassword">Current Password *</FieldLabel>
        <FieldDescription>Enter your current password to verify your identity</FieldDescription>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
          >
            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      {/* New Password */}
      <Field>
        <FieldLabel htmlFor="newPassword">New Password *</FieldLabel>
        <FieldDescription>
          Choose a strong password (at least {MIN_PASSWORD_LENGTH} characters)
        </FieldDescription>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      {/* Password Strength Indicator */}
      <PasswordStrength password={newPassword} />

      {/* Confirm New Password */}
      <Field>
        <FieldLabel htmlFor="confirmPassword">Confirm New Password *</FieldLabel>
        <FieldDescription>Re-enter your new password to confirm</FieldDescription>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className={cn(
              "pr-10",
              confirmPassword.length > 0 && !passwordsMatch && "border-red-300"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
        )}
        {passwordsMatch && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <Check className="h-3 w-3" /> Passwords match
          </p>
        )}
      </Field>

      {/* Notifications */}
      <Notification type="error" message={error} />
      <Notification type="success" message={success} />

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
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting && <Spinner className="mr-2" />}
          {isSubmitting ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}