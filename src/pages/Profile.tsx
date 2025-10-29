import React from 'react';

const Profile: React.FC = () => {
  return (
    <main className="flex flex-col items-center gap-6 max-w-7xl mx-auto px-4 py-6 bg-white">
      
      {/* Profile Card */}
      <section className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md w-full max-w-xl">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-pink-200 flex items-center justify-center mb-4">
          {/* out of scope: Should emoji be replaced with real profile image for better personalization */}
          <img
            src="./src/assets/avatar.png"
            alt="Jack Sparrow"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        {/* Name & Rating */}
        <h2 className="text-xl font-bold mb-2">Jack Sparrow</h2>
        <div className="flex items-center mb-3" aria-label="Rating">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">★</span>
          ))}
          <span className="text-gray-300 text-lg">★</span>
        </div>
        {/* Role & Joined Date */}
        <div className="flex items-center text-gray-600 gap-2 mb-2">
          <span>👜 Sailor</span>
          <span>• Joined Jan 2025</span>
        </div>
        {/* Location */}
        <div className="text-gray-500 mb-4">📍 Copenhagen, Denmark</div>
        {/* Actions */}
        <div className="flex gap-2 mb-4">
          <button
            aria-label="Send email"
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Email
          </button>
          <button
            aria-label="Send message"
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Message
          </button>
          <button
            aria-label="Call contact"
            className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Call
          </button>
        </div>
      </section>

      {/* Profile Sections */}
      <section className="flex flex-col gap-6 w-full max-w-2xl p-4">
        {/* About & Hobbies */}
        <article>
          <h3 className="font-semibold mb-2 text-lg">About & Hobbies</h3>
          <p className="text-gray-600 text-sm">
            {/* Replace with real content */}
            Jack Sparrow was a legendary pirate of the Seven Seas, known for his wit and cunning. His adventures spanned the Caribbean and beyond...
          </p>
        </article>

        {/* Experience Log */}
        <article>
          <h3 className="font-semibold mb-2 text-lg">Experience Log</h3>
          {/* Experience Entry */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded shadow-sm hover:bg-gray-100 transition">
            {/* Placeholder Image or Icon */}
            <div className="w-16 h-16 bg-blue-200 rounded-md flex items-center justify-center text-3xl">
              🌍
            </div>
            <div>
              <h4 className="font-medium mb-1">Island Hopping <span className="ml-2">🏝️🧑‍🤝‍🧑🌈🚤🎉</span></h4>
              <p className="text-gray-500 text-sm mb-1">Fiscardo to Ithaca, Greece</p>
              <p className="text-gray-500 text-sm mb-1">52m (171ft) Motor Yacht</p>
              <p className="text-gray-500 text-sm">12th Sep 2025</p>
            </div>
          </div>
        </article>

        {/* Qualifications */}
        <section>
          <h3 className="font-semibold mb-2 text-lg">Qualifications</h3>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            <li>ICC</li>
            <li>Marine VHF Radio</li>
          </ul>
        </section>

        {/* Skills */}
        <section>
          <h3 className="font-semibold mb-2 text-lg">Skills</h3>
          <p className="text-gray-600 text-sm">Describe skills here...</p>
        </section>

        {/* Feedback */}
        <section>
          <h3 className="font-semibold mb-2 text-lg">Feedback</h3>
          <p className="text-gray-600 text-sm">Comments or reviews...</p>
        </section>
      </section>
    </main>
  );
};

export default Profile;
