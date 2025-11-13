import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarItem {
  id: number | string;
  avatarSrc: string;
  className?: string;
}

interface AvatarStackProps {
  data: AvatarItem[];
  size?: string;
  overlap?: string;
}

export function AvatarStack({ data, size = "size-10", overlap = "-space-x-3" }: AvatarStackProps) {
  return (
    <div className={cn("flex", overlap)}>
      {data.map((item, i) => (
        <Avatar
          key={item.id}
          className={cn(size, "select-none", item.className)}
          style={{ zIndex: data.length - i }}
        >
          <AvatarImage src={item.avatarSrc} alt={`Avatar ${item.id}`} />
          <AvatarFallback>{item.id}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

export default AvatarStack;
