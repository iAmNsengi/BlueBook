import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  return (
    <div className="h-screen mt-20 text-white">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              My Profile <span className="animate-pulse">🤡</span>
            </h1>
            <p className="mt-4">My profile information</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
