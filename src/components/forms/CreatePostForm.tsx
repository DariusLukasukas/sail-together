import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import Parse from "@/lib/parse/client";
import { getCurrentUser } from "@/lib/parse/auth";

type CreatePostFormProps = React.ComponentProps<"form"> & {
  onCancel?: () => void;
  onCreated?: () => void;
};

export default function CreatePostForm({
  className,
  onCancel,
  onCreated,
  ...props
}: CreatePostFormProps) {
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasMediaUrl = mediaUrl.trim().length > 0;
  const isFormValid = hasMediaUrl;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError("You must be logged in to create a post");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const Post = Parse.Object.extend("Post");
      const post = new Post();

      // Pointer til _User
      post.set("userId", currentUser);

      // Matcher Post-schema: mediaUrl required, mediaAlt optional
      post.set("mediaUrl", mediaUrl.trim());
      if (caption.trim()) {
        post.set("mediaAlt", caption.trim());
      }

      // Defaultværdier
      post.set("likeCount", 0);
      post.set("commentCount", 0);

      await post.save();

      setSuccess("Post created successfully!");
      setMediaUrl("");
      setCaption("");

      if (onCreated) {
        onCreated();
      }
    } catch (err: any) {
      console.error("Error creating post:", err);
      const message = err instanceof Error ? err.message : "Failed to create post";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancelClick() {
    setMediaUrl("");
    setCaption("");
    setError("");
    setSuccess("");
    if (onCancel) onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid gap-4 [&>div]:grid [&>div]:gap-3 py-2", className)}
      {...props}
    >
      <div>
        <Label htmlFor="caption">Text</Label>
        <Input
          id="caption"
          type="text"
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="mediaUrl">Image URL</Label>
        <Input
          id="mediaUrl"
          type="url"
          required
          placeholder="https://example.com/your-photo.jpg"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="min-h-20"
        />
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="w-full rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-center text-sm font-medium text-destructive"
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

      <div className="mt-1 flex w-full gap-2">
        <Button
          type="button"
          onClick={handleCancelClick}
          variant="outline"
          className="w-full rounded-xl border border-gray-200 bg-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl bg-blue-500 text-white hover:bg-blue-600"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting && <Spinner />}
          Post
        </Button>
      </div>
    </form>
  );
}
