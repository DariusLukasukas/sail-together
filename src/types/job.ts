export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface Location {
  name: string;
  address: string;
  coordinates: Coordinates;
}

export interface JobMeta {
  description: string;
  requirements: string[];
  experience: string[];
  qualifications: string[];
}

export interface Job {
  id: string;
  title: string;
  type: string;
  date: string;
  vessel: string;
  isFavorite?: boolean;
  location: Location;
  meta: JobMeta;
}
