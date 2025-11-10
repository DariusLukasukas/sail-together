import type { Post } from "@/types/post";
import { PostCard } from "./PostCard";

type FeedProps = { initialPosts?: Post[]; isLoading?: boolean; error?: string | null };

export function Feed({ initialPosts = [], isLoading = false, error = null }: FeedProps) {
  if (isLoading) {
    return <p className="text-gray-500 text-center">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (initialPosts.length === 0) {
    return <p className="text-center text-gray-500">No posts available. Where is everybody?</p>;
  }

  return (
    <div
    //Updated in order to make the space between the Postcards and Post-thing a little bigger
      className="mx-auto max-w-xl space-y-8 pb-2"
      role="feed"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {initialPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
