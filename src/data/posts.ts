import type { Post } from "@/types/post";
import avatarImage from "@/assets/avatar.png";

export const POSTS: Post[] = [
  {
    id: "1",
    userId: "u1", // Would reference actual user ID
    mediaUrl: "/beach.jpg",
    mediaAlt: "nice beach",
    locationId: "loc-9", // St. Thomas
    createdAt: "2025-11-12T10:00:00Z",
    likeCount: 5,
    commentCount: 3,
  },
  {
    id: "2",
    userId: "u1",
    mediaUrl: "/greenland.jpg",
    mediaAlt: "very cold",
    locationId: "loc-10", // Nuuk, Greenland
    createdAt: "2025-11-11T10:00:00Z",
    likeCount: 10,
    commentCount: 2,
  },
  {
    id: "3",
    userId: "u1",
    mediaUrl: "/copenhagen.jpg",
    mediaAlt: "funny houses",
    locationId: "loc-11", // Copenhagen
    createdAt: "2025-11-10T10:00:00Z",
    likeCount: 8,
    commentCount: 5,
  },
];

// Helper to get posts with relations for display
import type { PostWithRelations } from "@/types/post";
import { LOCATIONS } from "./locations";

const MOCK_USER = {
  id: "u1",
  name: "Amelia R.",
  avatarUrl: avatarImage,
};

export function getPostsWithRelations(): PostWithRelations[] {
  return POSTS.map((post) => {
    const location = post.locationId ? LOCATIONS.find((loc) => loc.id === post.locationId) : undefined;
    return {
      ...post,
      user: MOCK_USER,
      location: location
        ? {
            id: location.id,
            name: location.name,
            address: location.address,
            longitude: location.longitude,
            latitude: location.latitude,
          }
        : undefined,
      hasLiked: post.id === "2", // Mock: second post is liked
    };
  });
}

