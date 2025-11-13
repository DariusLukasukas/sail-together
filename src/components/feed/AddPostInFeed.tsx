import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import avatarImage from "@/assets/avatar.png";
import AddPostPopUp from "./AddPostPopUp";

type AddPostInFeedProps = {
  onAddPostClick?: () => void;
  className?: string;
};

export default function AddPostInFeed({ onAddPostClick, className }: AddPostInFeedProps) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <div
        className={`rounded-3xl bg-white/70 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur flex items-center gap-3 ${className ?? ""}`}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarImage} alt="User avatar" />
          <AvatarFallback></AvatarFallback>
        </Avatar>

        <span className="flex-1 text-gray-500">What's new?</span>

        <Button
          onClick={() => {
            onAddPostClick?.();
            setApplyOpen(true);
          }}
          className="rounded-xl"
        >
          Add Post
        </Button>
      </div>

      <AddPostPopUp applyOpen={applyOpen} setApplyOpen={setApplyOpen} />
    </>
  );
}