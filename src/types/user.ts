export interface Experience {
  id: string;
  title: string;
  location: string;
  vessel: string;
  date: string;
}

export interface Qualification {
  id: string;
  name: string;
}

export interface Feedback {
  id: string;
  author: string;
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  rating?: number;
  role?: string;
  joinedDate: string;
  location?: string;
  about?: string;
  experiences: Experience[];
  qualifications: Qualification[];
  skills?: string[];
  feedback: Feedback[];
}
