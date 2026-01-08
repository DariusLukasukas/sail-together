import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import Parse from "@/lib/parse/client";

// Types
export interface Profile {
  id: string;
  username: string;
  email: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  location?: string;
  about?: string;
  role?: string;
  rating?: number;
  skills?: string[];
  createdAt?: Date;
  qualifications?: Qualification[];
  experiences?: Experience[];
  feedback?: Feedback[];
}

export interface Qualification {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  title: string;
  location: string;
  vessel: string;
  date: Date;
  image?: string;
}

export interface Feedback {
  id: string;
  author: {
    name?: string;
  };
  comment: string;
  createdAt?: Date;
}

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  optimisticUpdate: (updates: Partial<Profile>) => void;
}

// Context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider
interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentUser = Parse.User.current();
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      await currentUser.fetch();

      const profileData: Profile = {
        id: currentUser.id,
        username: currentUser.get("username"),
        email: currentUser.get("email"),
        name: currentUser.get("name"),
        phone: currentUser.get("phone"),
        avatarUrl: currentUser.get("avatarUrl"),
        location: currentUser.get("location"),
        about: currentUser.get("about"),
        role: currentUser.get("role"),
        rating: currentUser.get("rating"),
        skills: currentUser.get("skills"),
        createdAt: currentUser.get("createdAt"),
        qualifications: currentUser.get("qualifications"),
        experiences: currentUser.get("experiences"),
        feedback: currentUser.get("feedback"),
      };

      setProfile(profileData);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch profile"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const optimisticUpdate = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!profile) throw new Error("No profile loaded");

    const previousProfile = profile;
    
    // Optimistic update
    optimisticUpdate(updates);

    try {
      const currentUser = Parse.User.current();
      if (!currentUser) throw new Error("No authenticated user");

      // Update Parse user object
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          currentUser.set(key, value);
        }
      });

      await currentUser.save();
      
      // Refetch to ensure consistency
      await fetchProfile();
    } catch (err) {
      // Rollback on error
      setProfile(previousProfile);
      throw err;
    }
  }, [profile, optimisticUpdate, fetchProfile]);

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) throw new Error("No authenticated user");

      // Verify current password by attempting to log in
      await Parse.User.logIn(currentUser.get("username"), currentPassword);

      // Update password
      currentUser.set("password", newPassword);
      await currentUser.save();

      // Optional: Invalidate other sessions
      // await Parse.Cloud.run("invalidateAllOtherSessions");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Invalid username/password")) {
          throw new Error("Current password is incorrect");
        }
      }
      throw err;
    }
  }, []);

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
    updatePassword,
    optimisticUpdate,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// Hook
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}