import { useEffect, useState } from "react";
import { Feed } from "../components/feed/Feed";
import type { Post } from "../types/post";
import avatarImage from "../assets/avatar.png";


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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    likeCount: 8,
    commentCount: 5,
    hasLiked: false,
  }
];

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setTimeout(() => setPosts(mockPosts), 300);
  }, []);

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 pt-6 pb-24">
      <header className="mb-6 w-full text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Your feed</h1>
        <p className="text-sm text-muted-foreground">
          See news from friends
        </p>
      </header>

      <Feed initialPosts={posts} />
    </main>
  );
} 
