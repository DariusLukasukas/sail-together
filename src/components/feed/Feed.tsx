import type { Post } from "../../types/post";
import { PostCard } from "./PostCard";

type FeedProps = { initialPosts?: Post[] };

export function Feed({ initialPosts = [] }: FeedProps) {
  if (initialPosts.length === 0) {
    return <p className="text-center text-gray-500">Feed loading...</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 pb-2">
      {initialPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}