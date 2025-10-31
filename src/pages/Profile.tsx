import React from "react";
import { format } from "date-fns";
import type { UserProfile, UserExperience } from "../types/user";
import avatarImage from "../assets/avatar.png";
import { Star, MapPin, Briefcase, Ship, CalendarDays, User, Radio } from "lucide-react"; //
import AvatarStack from "@/components/ui/AvatarStack";
import memoji1 from "@/assets/feedback/memoji-1.png";
import memoji2 from "@/assets/feedback/memoji-2.png";
import memoji3 from "@/assets/feedback/memoji-3.png";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MOCK_USER_DATA: UserProfile = {
  id: "1",
  name: "Clara A.",
  email: "clara.a@example.com",
  phone: "+1234567890",
  avatarUrl: avatarImage,
  rating: 4.5,
  role: "Stewardess",
  joinedDate: "2025-01-15T10:00:00Z",
  location: "Copenhagen, Denmark",
  about: "Description....",
  experiences: [
    {
      id: "e1",
      title: "Island Hopping",
      location: "Fiscardo to Ithaca, Greece",
      vessel: "52m (171ft) Motor Yacht",
      date: "2025-09-12T00:00:00Z",
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
type ExperienceEntryProps = {
  experience: UserExperience;
};

const ExperienceEntry = ({ experience }: ExperienceEntryProps) => {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      <div className="size-24 rounded-3xl bg-neutral-300" />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-gray-900">{experience.title}</h4>
          <AvatarStack data={mockFeedbackAvatars} size={"size-7"} />
        </div>
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
    <main className="mx-auto flex w-full max-w-xl flex-col items-start gap-6 px-4 py-6">
      {/* Profile Card Section */}
      <section className="flex w-full flex-col items-center gap-2 p-6">
        <Avatar className="size-24 rounded-3xl bg-[#FFC7D6]">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>

        {/* Name & Rating */}
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <StarRating rating={user.rating} />

        {/* Role & Joined Date */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" /> {user.role}
          </span>
          <span>• Joined {format(new Date(user.joinedDate), "MMM yyyy")}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400" /> {user.location}
        </div>

        {/* Actions (updated button style) */}
        <div className="flex gap-2">
          <Button
            aria-label="Send email"
            variant={"secondary"}
            onClick={() => (window.location.href = `mailto:${user.email}`)}
            className="rounded-full"
          >
            Email
          </Button>
          <Button aria-label="Send message" variant={"secondary"} className="rounded-full">
            Message
          </Button>
          {user.phone && (
            <Button
              aria-label="Call contact"
              variant={"secondary"}
              onClick={() => (window.location.href = `tel:${user.phone}`)}
              className="rounded-full"
            >
              Call
            </Button>
          )}
        </div>
      </section>

      {/* Profile Sections  */}
      <section className="flex w-full flex-col gap-6 p-4">
        {/* About & Hobbies */}
        <article>
          <h3 className="text-lg font-semibold">About & Hobbies</h3>
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
          </div>
        </article>

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
