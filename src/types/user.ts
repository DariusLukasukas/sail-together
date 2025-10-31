// A type for a single experience log entry
export type UserExperience = {
  id: string;
  title: string;
  location: string;
  vessel: string;
  date: string; // ISO date strings (e.g., "2025-09-12T00:00:00Z")
  icon?: string; // An emoji
};

// The main profile data structure
export type UserProfile = {
  id: string;
  name: string;
  email: string; // Added for the "Email" button
  phone?: string; // Added for the "Call" button
  avatarUrl: string;
  rating: number; // A number from 0 to 5
  role: string;
  joinedDate: string; // ISO date string
  location: string;
  about: string;
  experiences: UserExperience[];
  qualifications: string[];
  skills: string;
  feedback: string[]; // A list of feedback comments
};
