export type UserExperience = {
  id: string;
  title: string;
  location: string;
  vessel: string;
  date: string;
  icon?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  rating: number;
  role: string;
  joinedDate: string;
  location: string;
  about: string;
  experiences: UserExperience[];
  qualifications: string[];
  skills: string;
  feedback: string[];
};
