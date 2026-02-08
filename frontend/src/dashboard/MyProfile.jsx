import React, { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

function MyProfile() {
  const { profile } = useAuth();

  useEffect(() => {
    console.log("Profile object after fetch:", profile);
  }, [profile]); // runs when profile changes

  if (!profile) {
    return <p>Loading profile...</p>; // optional loading state
  }

  const userPhoto = profile?.photo?.url || profile?.photo || "/default-avatar.png";

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full">
          <div className="relative">
            <img src={userPhoto} alt="avatar" className="w-full h-auto object-cover" />
            <div className="absolute inset-x-0 bottom-0 transform translate-y-1/2">
              <img
                src={userPhoto}
                alt="avatar"
                className="w-24 h-24 rounded-full mx-auto border-4 border-gray-700"
              />
            </div>
          </div>

          <div className="px-6 py-8 mt-2">
            <h2 className="text-center text-2xl font-semibold text-gray-800">
              {profile?.name || "User Name"}
            </h2>
            <p className="text-center text-gray-600 mt-2">{profile?.email || "user@example.com"}</p>
            <p className="text-center text-gray-600 mt-2">{profile?.phone || "000-000-0000"}</p>
            <p className="text-center text-gray-600 mt-2">{profile?.role || "Role"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;