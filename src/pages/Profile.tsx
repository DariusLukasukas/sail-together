import React from "react";
//import { useParams } from "react-router-dom"; // To read the ID from the URL
import { format } from "date-fns"; //  dates
import type { UserProfile, UserExperience } from "../types/user";
import avatarImage from "../assets/avatar.png";
import { Star, MapPin, Briefcase, Ship, CalendarDays, User, Radio } from "lucide-react"; //
import AvatarStack from "@/components/ui/AvatarStack"; // Import your new component
import memoji1 from "@/assets/feedback/memoji-1.png"; // Import the images
import memoji2 from "@/assets/feedback/memoji-2.png";
import memoji3 from "@/assets/feedback/memoji-3.png";

// --- Mock Data ---
// Mock profile: http://localhost:5173/profile/any-id-works
// Updated to match the Figma design (Clara A., Stewardess, etc.)
const MOCK_USER_DATA: UserProfile = {
  id: "1",
  name: "Clara A.",
  email: "clara.a@example.com",
  phone: "+1234567890",
  avatarUrl: avatarImage,
  rating: 4.5, // <-- Set to 4.5 for half-star logic
  role: "Stewardess",
  joinedDate: "2025-01-15T10:00:00Z",
  location: "Copenhagen, Denmark",
  about: "Description....",
  experiences: [
    {
      id: "e1",
      title: "Island Hopping 🏝️🧑‍🤝‍🧑🌈🚤🎉",
      location: "Fiscardo to Ithaca, Greece",
      vessel: "52m (171ft) Motor Yacht",
      date: "2025-09-12T00:00:00Z",
      // use a placeholder for the map image
      icon: "https://placehold.co/100x100/E0E0E0/B0B0B0?text=Map",
    },
  ],
  qualifications: ["ICC", "Marine VHF Radio"],
  skills: "Description....",
  feedback: ["Comments...."],
};

// --- NEW MOCK DATA FOR FEEDBACK AVATARS ---
const mockFeedbackAvatars = [
  { id: 1, avatarSrc: memoji1, className: "bg-red-500" },
  { id: 2, avatarSrc: memoji2, className: "bg-green-500" },
  { id: 3, avatarSrc: memoji3, className: "bg-yellow-500" },
];

// --- Child Component ---
// Updated to match the Figma design
type ExperienceEntryProps = {
  experience: UserExperience;
};

const ExperienceEntry = ({ experience }: ExperienceEntryProps) => {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      <img
        src={experience.icon} // Using the placeholder URL from mock data
        alt={experience.title}
        className="h-20 w-20 flex-shrink-0 rounded-md bg-gray-100 object-cover"
      />
      <div className="flex flex-col gap-1.5">
        <h4 className="font-semibold text-gray-900">{experience.title}</h4>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" />
          {experience.location}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <Ship className="h-4 w-4 text-gray-400" />
          {experience.vessel}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          {format(new Date(experience.date), "do MMM yyyy")}
        </p>
      </div>
    </div>
  );
};
// --- Helper: Star Rating ---
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="h-5 w-5 text-yellow-400" />
          <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
};
// --- Main Profile Component ---
const Profile: React.FC = () => {
  const user = MOCK_USER_DATA;
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-6 bg-white px-4 py-6">
      {/* Profile Card Section */}
      <section className="flex w-full flex-col items-center bg-white p-6">
        {/* Avatar  */}
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="mb-4 h-24 w-24 rounded-3xl object-cover"
        />

        {/* Name & Rating */}
        <h2 className="mb-2 text-2xl font-bold">{user.name}</h2>
        <div className="mb-4">
          <StarRating rating={user.rating} />
        </div>

        {/* Role & Joined Date */}
        <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" /> {user.role}
          </span>
          <span>• Joined {format(new Date(user.joinedDate), "MMM yyyy")}</span>
        </div>

        {/* Location */}
        <div className="mb-6 flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" /> {user.location}
        </div>

        {/* Actions (updated button style) */}
        <div className="mb-4 flex gap-2">
          <button
            aria-label="Send email"
            onClick={() => (window.location.href = `mailto:${user.email}`)}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Email
          </button>
          <button
            aria-label="Send message"
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Message
          </button>
          {user.phone && (
            <button
              aria-label="Call contact"
              onClick={() => (window.location.href = `tel:${user.phone}`)}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Call
            </button>
          )}
        </div>
      </section>

      {/* Profile Sections  */}
      <section className="flex w-full flex-col gap-6 p-4">
        {/* About & Hobbies */}
        <article>
          <h3 className="mb-2 text-lg font-semibold">About & Hobbies</h3>
          <p className="text-sm text-gray-600">{user.about}</p>
        </article>
        <hr className="border-gray-100" />

        {/* Experience Log */}
        <article>
          <h3 className="mb-2 text-lg font-semibold">Experience Log</h3>
          <div className="flex flex-col">
            {user.experiences.map((exp) => (
              <ExperienceEntry key={exp.id} experience={exp} />
            ))}
            {/*  AvatarStack  */}
            <AvatarStack data={mockFeedbackAvatars} />
          </div>
        </article>
        <hr className="border-gray-100" />

        {/* Qualifications */}
        <section>
          <h3 className="mb-2 text-lg font-semibold">Qualifications</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User className="h-4 w-4 text-gray-400" />
              <span>ICC</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Radio className="h-4 w-4 text-gray-400" />
              <span>Marine VHF Radio</span>
            </div>
            {/* Added the third one from your original code */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="w-4" /> {/* Spacer */}
              <span>STCW Basic Safety Training</span>
            </div>
          </div>
        </section>
        <hr className="border-gray-100" />

        {/* Skills */}
        <section>
          <h3 className="mb-2 text-lg font-semibold">Skills</h3>
          <p className="text-sm text-gray-600">{user.skills}</p>
        </section>
        <hr className="border-gray-100" />

        {/* Feedback */}
        <section>
          <h3 className="mb-3 text-lg font-semibold">Feedback</h3>
          <div className="flex flex-col gap-4">
            {/* Keep the original text comments */}
            <div className="flex flex-col gap-2">
              {user.feedback.map((f, i) => (
                <p key={i} className="text-sm text-gray-600">
                  {f}
                </p>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Profile;
