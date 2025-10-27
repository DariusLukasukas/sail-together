// components/feed/PostCard.tsx
import type { Post } from "../../types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu";
import { useState } from "react";

type PostCardProps = { post: Post };

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.hasLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  async function toggleLike() {
    setLiked(v => !v);
    setLikeCount(c => (liked ? c - 1 : c + 1));
  }

  return (
    <article className="rounded-3xl bg-white/70 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur">
      {/* Header */}
      <header className="flex items-center gap-3 px-2 py-1">
  <Avatar className="h-8 w-8">
    <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
    <AvatarFallback>
      {post.user.name
        .split(" ")
        .map((s) => s[0]?.toUpperCase())
        .slice(0, 2)
        .join("")}
    </AvatarFallback>
  </Avatar>

  <div className="min-w-0 flex-1">
    <div className="flex items-center gap-2">
      <p className="truncate font-medium">{post.user.name}</p>
      {post.location?.name && (
        <span className="truncate text-xs text-gray-500">• {post.location.name}</span>
      )}
    </div>
    <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
  </div>

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label="More options"
        className="rounded-xl p-2 hover:bg-black/5"
      >
        &#8226;&#8226;&#8226;
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuItem
        onSelect={() => {
          // Kræver https/localhost for at virke i browseren
          void navigator.clipboard.writeText(`/post/${post.id}`);
        }}
      >
        Copy link
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => { /* TODO: report */ }}>
        Report an issue
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</header>


      {/* Media */}
      <figure className="mt-2 overflow-hidden rounded-2xl">
        <img
          src={post.mediaUrl}
          alt={post.mediaAlt ?? "Sail Away post"}
          className="h-auto w-full"
          loading="lazy"
        />
      </figure>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-3 px-2">
        <Button variant="ghost" aria-pressed={liked} onClick={toggleLike}>
          {liked ? "♥︎" : "♡"} Like
        </Button>
        <Button variant="ghost">Comment</Button>
        <Button variant="ghost">↗ Share</Button>
        <span className="ml-auto text-sm text-gray-500">{likeCount} likes · {post.commentCount} comments</span>
      </div>

      {/* Comments preview */}
      {post.commentsPreview?.length ? (
        <ul className="mt-2 space-y-1 px-2">
          {post.commentsPreview.map(c => (
            <li key={c.id} className="text-sm">
              <span className="font-medium">{c.user.name}</span>{" "}
              <span className="text-gray-700">{c.text}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Comment input – kan aktiveres via state */}
      {/* <CommentInput postId={post.id} /> */}
    </article>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 36e5);
  if (h < 1) return "Right now";
  if (h === 1) return "1 hour ago";
  return `${h} hours ago`;
}
