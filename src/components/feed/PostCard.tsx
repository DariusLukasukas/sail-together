import type { PostWithRelations } from "@/types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { togglePostLike } from "@/features/posts/api";
import { Heart } from "lucide-react";

/** Props to PostCard. */
type PostCardProps = { post: PostWithRelations };

/** Returnerer up to two initials. */
function getUserName(name: string) {
  return name
    .trim()
    .split(" ")
    .map((s) => s[0]?.toUpperCase() ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

/** Capitalize each word in a name for proper display. */
function capitalizeName(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((word) => {
      if (!word) return "";
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/** Relative time being tracked. */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Right now";
  if (minutes < 60) return `${minutes} minutes${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function PostCard({ post }: PostCardProps) {
  const {
    id,
    user,
    location,
    mediaUrl,
    mediaAlt,
    createdAt,
    likeCount: initialLikes,
    hasLiked,
    commentCount,
  } = post;


  const [liked, setLiked] = useState(!!hasLiked);
  const [likeCount, setLikeCount] = useState(initialLikes ?? 0);
  const [isSavingLike, setIsSavingLike] = useState(false);

  async function toggleLike() {
    if (isSavingLike) return;

    const prevLiked = liked;
    const prevCount = likeCount;

    const nextLiked = !prevLiked;
    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));

    setIsSavingLike(true);
    try {
      const res = await togglePostLike(id);
      setLiked(res.liked);
      setLikeCount(res.likeCount);
    } catch (err) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      console.error("Failed to toggle like:", err);
    } finally {
      setIsSavingLike(false);
    }
  }

  return (
    <article className="rounded-3xl bg-white/70 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur">
      <Header
        name={user.name}
        avatarUrl={user.avatarUrl}
        locationName={location?.name}
        createdAt={String(createdAt)}
      />

<figure className="mt-2 overflow-hidden rounded-2xl">
        <div className="relative w-full aspect-square">
          <img
            src={mediaUrl}
            alt={mediaAlt ?? "Sail Away post"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </figure>

      {mediaAlt && (
        <p className="mt-2 px-2 text-sm text-gray-800 break-words">
          {mediaAlt}
        </p>
      )}

      <Actions
      liked={liked ?? false}
      likeCount={likeCount}
      commentCount={commentCount}
      onToggleLike={toggleLike}
      disabled={isSavingLike}
      />
    </article>
  );
}

/** Header (avatar, name, location, time and menu). */
function Header(props: {
  name: string;
  avatarUrl: string;
  locationName?: string;
  createdAt: string;
}) {
  const { name, avatarUrl, locationName, createdAt } = props;

  return (
    <header className="flex items-center gap-3 px-2 py-1">
      <Avatar className="h-8 w-8">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
        <AvatarFallback>{getUserName(name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{capitalizeName(name)}</p>
          {locationName && <span className="truncate text-xs text-gray-500">• {locationName}</span>}
        </div>
        <p className="text-xs text-gray-400">{timeAgo(createdAt)}</p>
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
          <DropdownMenuItem>Copy link</DropdownMenuItem>
          <DropdownMenuItem>Report an issue</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

/** Buttons and count under picture. */
function Actions(props: {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  onToggleLike: () => void;
  disabled?: boolean;
}) {
  const { liked, likeCount, commentCount, onToggleLike, disabled } = props;
  const heartClass = liked ? "h-5 w-5 fill-red-500 text-red-500" : "h-5 w-5 text-gray-600";
  
  return (
    <div className="mt-3 flex items-center gap-3 px-2">
      <Button
        variant="ghost"
        onClick={onToggleLike}
        disabled={disabled}
        aria-pressed={liked}
        className="flex items-center gap-1"
      >
        <Heart className={heartClass} />
        <span>Like</span>
      </Button>
  
      <Button variant="ghost">Comment</Button>
      <Button variant="ghost">↗ Share</Button>
  
      <span className="ml-auto text-sm text-gray-500">
        {likeCount} likes · {commentCount} comments
      </span>
    </div>
  );

}