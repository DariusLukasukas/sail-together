import avatarFallbackImg from "@/assets/avatar.png";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

type UserLike = { get?: (key: string) => unknown } | null | undefined;

type AvatarUserProps = React.ComponentProps<typeof Avatar> & {
  user: UserLike;
  alt?: string;
  fallbackInitials?: string;
};

function getInitials(name?: string, username?: string, fallback = "CL") {
  const source = name || username;
  if (!source) return fallback;
  const initials = source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
  return initials || fallback;
}

export function AvatarUser({
  user,
  className,
  alt = "profile avatar",
  fallbackInitials = "CL",
  ...props
}: AvatarUserProps) {
  const avatarUrl = (user?.get?.("avatarUrl") as string | undefined) || undefined;
  const displayName = (user?.get?.("name") as string | undefined) || (user?.get?.("username") as string | undefined);
  const initials = getInitials(displayName, undefined, fallbackInitials);

  return (
    <Avatar className={cn("select-none", className)} {...props}>
      <AvatarImage src={avatarUrl || avatarFallbackImg} alt={alt} />
      <AvatarFallback delayMs={100}>{initials}</AvatarFallback>
    </Avatar>
  );
}

