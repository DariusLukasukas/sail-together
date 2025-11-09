import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Feed } from "../components/feed/Feed";
import AddPostPopUp from "../components/feed/AddPostPopUp";
import type { Post } from "../types/post";
import avatarImage from "../assets/avatar.png";

const now = Date.now();
const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Amelia R.",
      avatarUrl: avatarImage,
    },
    mediaUrl: "/beach.jpg",
    mediaAlt: "nice beach",
    location: { name: "St. Thomas, U.S. Virgin Islands" },
    createdAt: new Date(now - 1 * 60 * 1000).toISOString(),
    likeCount: 5,
    commentCount: 3,
    hasLiked: false,
  },
  {
    id: "2",
    user: {
      id: "u1",
      name: "Amelia R.",
      avatarUrl: avatarImage,
    },
    mediaUrl: "/greenland.jpg",
    mediaAlt: "very cold",
    location: { name: "Nuuk, Greenland" },
    createdAt: new Date(now - 23 * 60 * 60 * 1000).toISOString(),
    likeCount: 10,
    commentCount: 2,
    hasLiked: true,
  },
  {
    id: "3",
    user: {
      id: "u1",
      name: "Amelia R.",
      avatarUrl: avatarImage,
    },
    mediaUrl: "/copenhagen.jpg",
    mediaAlt: "funny houses",
    location: { name: "Copenhagen, Denmark" },
    createdAt: new Date(now - 71 * 60 * 60 * 1000).toISOString(),
    likeCount: 8,
    commentCount: 5,
    hasLiked: false,
  },
];

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // open when ?addPost=1
  const isAddPostOpen = useMemo(() => params.get("addPost") === "1", [params]);

  const closeModal = () => {
    // remove the query param but stay on /explore
    navigate({ pathname: "/explore" }, { replace: true });
  };

  useEffect(() => {
    const id = setTimeout(() => setPosts(mockPosts), 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-6 pb-24">
      <header className="mb-6 w-full text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your feed</h1>
        <p className="text-muted-foreground text-sm">See news from friends</p>
      </header>

      <Feed initialPosts={posts} />

      <AddPostPopUp open={isAddPostOpen} onClose={closeModal} />
    </main>
  );
}
