// src/lib/mockApi.ts
import type { UserProfile } from "../types/user";

// Mock data for users
const MOCK_USER_DATA: UserProfile = {
  id: "1",
  name: "Jack Sparrow",
  email: "jack.sparrow@theblackpearl.com",
  phone: "+1234567890",
  avatarUrl: "/path/to/avatar.jpg", // Use current path
  rating: 4,
  role: "Sailor",
  joinedDate: "2025-01-15T10:00:00Z",
  location: "Copenhagen, Denmark",
  about:
    "Jack Sparrow was a legendary pirate of the Seven Seas, known for his wit and cunning. His adventures spanned the Caribbean and beyond...",
  experiences: [
    {
      id: "e1",
      title: "Island Hopping",
      location: "Fiscardo to Ithaca, Greece",
      vessel: "52m (171ft) Motor Yacht",
      date: "2025-09-12T00:00:00Z",
      icon: "🌍",
    },
    {
      id: "e2",
      title: "Transatlantic Crossing",
      location: "Bahamas to Mediterranean",
      vessel: "60m (197ft) Motor Yacht",
      date: "2024-05-01T00:00:00Z",
      icon: "⛵",
    },
  ],
  qualifications: ["ICC", "Marine VHF Radio", "STCW Basic Safety Training"],
  skills: "Navigation, sword fighting, witty escapes, and rum appreciation.",
  feedback: ["A bit unreliable, but gets the job done!", "Best pirate I've ever seen."],
};

// This function simulates fetching a user's profile from a server
export const fetchUserById = (userId: string): Promise<UserProfile> => {
  console.log(`Fetching user with id: ${userId}...`);
  return new Promise((resolve) => {
    // Simulate a network delay of 300ms
    setTimeout(() => {
      resolve(MOCK_USER_DATA);
    }, 300);
  });
};
