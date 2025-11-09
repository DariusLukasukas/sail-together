import { cn } from "@/lib/utils";
import StarIcon from "../icons/StarIcon";

interface RatingProps {
  value: number;
  max: number;
  size: number;
  className?: string;
}

function Rating({ value, max, size, className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }, (_, i) => {
        const full = i + 1 <= Math.floor(value);
        const half = !full && i < value;
        const starColor = full ? "text-[#FFCC00]" : "text-neutral-300";

        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <StarIcon
              className={cn("absolute top-0 left-0 shrink-0", starColor)}
              style={{ width: size, height: size }}
              fill={full ? "currentColor" : "none"}
            />
            {half && (
              <StarIcon
                className="absolute top-0 left-0 text-[#FFCC00]"
                style={{
                  width: size,
                  height: size,
                  clipPath: "inset(0 50% 0 0)",
                }}
                fill="currentColor"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export { Rating };
