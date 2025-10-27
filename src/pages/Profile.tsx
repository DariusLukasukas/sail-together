import React from 'react';

const Profile: React.FC = () => {

  return (
    <div className="flex flex-col items-center gap-6 w-[1440px] h-[1024px] py-6 bg-white mx-auto">
      {/* Top navigation */}
      

      {/* Profile Card */}
      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-md w-full max-w-xl">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-pink-200 flex items-center justify-center mb-2 text-5xl">
          {/* Substitute emoji or avatar image here */}
          <span role="img" aria-label="jack">🧑‍🦰</span>
        </div>
        {/* Name and Rating */}
        <h2 className="text-xl font-bold mt-1 mb-1">Jack Sparrow</h2>
        <div className="flex items-center mb-2">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">★</span>
          ))}
          <span className="text-gray-300 text-lg">★</span>
        </div>
        {/* Role & Meta Info */}
        <div className="flex items-center text-gray-600 gap-2 mb-1">
          <span>👜 Sailor</span>
          <span>• Joined Jan 2025</span>
        </div>
        <div className="text-gray-500 mb-2">
          📍 Copenhagen, Denmark
        </div>
        {/* Actions */}
        <div className="flex gap-2 mb-2">
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700">Email</button>
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700">Message</button>
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700">Call</button>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="flex flex-col gap-4 w-full max-w-xl">
        {/* About & Hobbies */}
        <section>
          <h3 className="font-semibold">About & Hobbies</h3>
          <p className="text-gray-600 text-sm">Jack Sparrow was a legendary pirate of the Seven Seas and the irreverent trickster of the Caribbean. 
           A captain of equally dubious morality and sobriety, a master of self-promotion and self-interest, 
           he fought a constant and losing battle with his own best tendencies while living the pirate's life. 
           Sparrow may be the best or worst pirate, depending on whose opinion to take into account, 
           and was the quickest to seize the moment and make it his own; whether by cause and careful planning or mere accident was a matter of debate, 
           but the results were the same and always different.....</p>
        </section>

        {/* Experience Log */}
        <section>
          <h3 className="font-semibold mb-1">Experience Log</h3>
          <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded">
            <div className="w-16 h-16 bg-blue-200 rounded-md flex items-center justify-center text-3xl">
              {/* Placeholder for image/map */}
              🌍
            </div>
            <div>
              <div className="font-medium">
                Island Hopping <span className="ml-1">🏝️🧑‍🤝‍🧑🌈🚤🎉</span>
              </div>
              <div className="text-gray-500 text-sm">Fiscardo to Ithaca, Greece</div>
              <div className="text-gray-500 text-sm">52m (171ft) Motor Yacht</div>
              <div className="text-gray-500 text-sm">12th Sep 2025</div>
            </div>
          </div>
        </section>

        {/* Qualifications */}
        <section>
          <h3 className="font-semibold">Qualifications</h3>
          <ul className="text-gray-600 text-sm list-disc list-inside">
            <li>ICC</li>
            <li>Marine VHF Radio</li>
          </ul>
        </section>

        {/* Skills */}
        <section>
          <h3 className="font-semibold">Skills</h3>
          <p className="text-gray-600 text-sm">Description....</p>
        </section>

        {/* Feedback */}
        <section>
          <h3 className="font-semibold">Feedback</h3>
          <p className="text-gray-600 text-sm">Comments....</p>
        </section>
      </div>
    </div>
  );
}
export default Profile;
