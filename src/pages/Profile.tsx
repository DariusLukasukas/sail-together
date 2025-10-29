import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // <-- To read the ID from the URL
import { format } from "date-fns"; // <-- To format dates
import type { UserProfile } from "../types/user"; // <-- Our new data types
import { fetchUserById } from "../lib/mockApi"; // <-- Our fake API
import { ExperienceEntry } from "../components/ExperienceEntry"; // <-- Our new component

const Profile: React.FC = () => {
  // --- Data and Loading State ---
  // The 'userId' from the URL, e.g., /profile/1 or /profile/any-id-works for now
  const { userId } = useParams<{ userId: string }>();

  // State to hold the user data once it's fetched
  const [user, setUser] = useState<UserProfile | null>(null);

  // State to show a loading message while we fetch
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching Effect ---
  useEffect(() => {
    // will not fetch if there's no userId
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await fetchUserById(userId); // <-- Fetch the data
        setUser(userData); // <-- Put it in state
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // should consider seting an error state here for the full stack web app
      } finally {
        setIsLoading(false); // <-- Stop loading
      }
    };

    loadUserProfile();
  }, [userId]); // <-- This effect re-runs if the userId in the URL changes like twitter

  // --- Loading and Error States ---could improve
  if (isLoading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-10 text-center">User not found.</div>;
  }

  // --- Render the Profile ---
  // there must be a user here!
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center gap-6 bg-white px-4 py-6">
      {/* Profile Card */}
      <section className="flex w-full max-w-xl flex-col items-center rounded-2xl bg-white p-8 shadow-md">
        {/* Avatar */}
        <img
          src={user.avatarUrl} // <-- DYNAMIC
          alt={user.name} // <-- DYNAMIC
          className="mb-4 h-20 w-20 rounded-full object-cover"
        />

        {/* Name & Rating */}
        <h2 className="mb-2 text-xl font-bold">{user.name}</h2>
        <div
          className="mb-3 flex items-center"
          //  accessibility!
          aria-label={`Rating: ${user.rating} out of 5 stars`}
        >
          {/* Create filled stars based on the user's rating */}
          {[...Array(user.rating)].map((_, i) => (
            <span key={`filled-${i}`} className="text-lg text-yellow-400">
              ★
            </span>
          ))}
          {/* Create empty stars for the remainder */}
          {[...Array(5 - user.rating)].map((_, i) => (
            <span key={`empty-${i}`} className="text-lg text-gray-300">
              ★
            </span>
          ))}
        </div>

        {/* Role & Joined Date */}
        <div className="mb-2 flex items-center gap-2 text-gray-600">
          {/* 'aria-hidden' hides decorative emojis from screen readers */}
          <span>
            <span aria-hidden="true">👜</span> {user.role}
          </span>
          <span>• Joined {format(new Date(user.joinedDate), "MMM yyyy")}</span>
        </div>

        {/* Location */}
        <div className="mb-4 text-gray-500">
          <span aria-hidden="true">📍</span> {user.location}
        </div>

        {/* Actions - are functional! */}
        <div className="mb-4 flex gap-2">
          <button
            aria-label="Send email"
            // opens the user's default email client
            onClick={() => (window.location.href = `mailto:${user.email}`)}
            className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Email
          </button>
          <button
            aria-label="Send message"
            onClick={() => {
              /* TODO or out of scope? Open chat modal */
            }}
            className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Message
          </button>
          {user.phone && ( // Only show 'Call' if a phone number exists
            <button
              aria-label="Call contact"
              // This opens the phone app on a mobile device, facetime on macbook
              onClick={() => (window.location.href = `tel:${user.phone}`)}
              className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Call
            </button>
          )}
        </div>
      </section>

      {/* Profile Sections */}
      <section className="flex w-full max-w-2xl flex-col gap-6 p-4">
        {/* About & Hobbies */}
        <article>
          <h3 className="mb-2 text-lg font-semibold">About & Hobbies</h3>
          <p className="text-sm text-gray-600">{user.about}</p>
        </article>

        {/* Experience Log */}
        <article>
          <h3 className="mb-2 text-lg font-semibold">Experience Log</h3>
          {/* map over the user's experiences and use the new component */}
          <div className="flex flex-col gap-3">
            {user.experiences.map((exp) => (
              <ExperienceEntry key={exp.id} experience={exp} />
            ))}
            {user.experiences.length === 0 && (
              <p className="text-sm text-gray-500">No experience logged yet.</p> //could be something funny!
            )}
          </div>
        </article>

        {/* Qualifications */}
        <section>
          <h3 className="mb-2 text-lg font-semibold">Qualifications</h3>
          {/* Render qualifications as a dynamic list */}
          <ul className="list-inside list-disc text-sm text-gray-600">
            {user.qualifications.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section>
          <h3 className="mb-2 text-lg font-semibold">Skills</h3>
          <p className="text-sm text-gray-600">{user.skills}</p>
        </section>

        {/* Feedback */}
        <section>
          <h3 className="mb-2 text-lg font-semibold">Feedback</h3>
          {/* Render feedback as a dynamic list */}
          <div className="flex flex-col gap-2">
            {user.feedback.map((f, i) => (
              <blockquote key={i} className="border-l-4 pl-4 text-sm text-gray-600 italic">
                "{f}"
              </blockquote>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Profile;
