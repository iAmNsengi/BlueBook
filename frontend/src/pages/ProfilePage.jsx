import React, { useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const fileRef = useRef();
  const handleInputChange = async (e) => {
    e.preventDefault();
    alert("Image changed");
    console.log(fileRef);
  };

  return (
    <div className="h-full mt-20 text-white">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300/80 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              My Profile <span className="animate-pulse">🤡</span>
            </h1>
            <p className="mt-4">My profile information</p>
          </div>
          {/* avatar upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={authUser.profilePic || "/avatar.png"}
                alt=""
                className="size-32 rounded-full object-cover border-2"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                } `}
              >
                <Camera className="size-5 text-base-200" />
                <input
                  type="file"
                  ref={fileRef}
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleInputChange}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="size-5 animate-spin font-bold" />{" "}
                  Uploading...
                </>
              ) : (
                "Click the camera icon to update your profile image 🌄"
              )}
            </p>
            <div className="space-y-5 mt-5">
              <div className="flex items-center justify-between gap-20 space-y-1 5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="size-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser.fullName}{" "}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 space-y-1 5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="size-4" />
                  Email
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser.email}{" "}
                </p>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
