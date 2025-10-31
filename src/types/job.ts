
export interface Job {
  id: number;
  favorite?: boolean;
  title: string;
  type: string;
  date: string;
  vessel: string;
  location: string;
  inMapArea?: boolean;
  jobDescription: string;
  requirements: string[];
  experience: string;
  qualifications: string[];
};
