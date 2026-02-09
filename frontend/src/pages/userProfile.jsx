import React, { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

function UserProfile() {
  const { profile } = useAuth();

  useEffect(() => {
  //  console.log("User profile:", profile);
  }, [profile]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  const userPhoto = profile?.photo?.url || profile?.photo || "/default-avatar.png";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm w-full">
        <div className="relative">
          <img src={userPhoto} alt="cover" className="w-full h-auto object-cover" />
          <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2">
            <img
              src={userPhoto}
              alt="avatar"
              className="w-24 h-24 rounded-full mx-auto border-4 border-gray-700"
            />
          </div>
        </div>

        <div className="px-6 py-8 mt-10">
          <h2 className="text-center text-2xl font-semibold text-gray-800">
            {profile?.name}
          </h2>
          <p className="text-center text-gray-600 mt-2">{profile?.email}</p>
          <p className="text-center text-gray-600 mt-2">{profile?.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
