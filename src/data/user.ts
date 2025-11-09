import type { UserProfile } from "@/types/user";
import avatarClara from "@/assets/avatar.png";

export const USER: UserProfile = {
  id: "1",
  name: "Clara Andersen",
  email: "clara.andersen@example.com",
  phone: "+45 5023 9876",
  avatarUrl: avatarClara,
  rating: 4,
  role: "Stewardess",
  joinedDate: "2025-01-15T10:00:00Z",
  location: "Copenhagen, Denmark",
  about:
    "Detail-oriented and experienced stewardess with a passion for creating exceptional guest experiences aboard luxury yachts.",
  experiences: [
    {
      id: "1",
      title: "Island Hopping Charter",
      location: "Fiscardo to Ithaca, Greece",
      vessel: "52m Motor Yacht",
      date: "2025-09-12T00:00:00Z",
    },
    {
      id: "2",
      title: "Mediterranean Season",
      location: "Cannes, France",
      vessel: "45m Sailing Yacht",
      date: "2024-07-04T00:00:00Z",
    },
  ],
  qualifications: [
    { id: "1", name: "STCW Basic Safety" },
    { id: "2", name: "ENG1 Medical" },
    { id: "3", name: "Food Hygiene Level 2" },
  ],
  skills: ["Hospitality", "Interior maintenance", "Provisioning", "Guest communication"],
  feedback: [
    {
      id: "1",
      author: "Captain J. Williams",
      comment: "Clara was incredibly professional and attentive to detail throughout the season.",
      createdAt: "2025-03-12T12:00:00Z",
    },
    {
      id: "2",
      author: "Chief Steward",
      comment: "A calm presence during stressful charters — great with guests and crew alike.",
      createdAt: "2025-04-28T09:30:00Z",
    },
  ],
};
