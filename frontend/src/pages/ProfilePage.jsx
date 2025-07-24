import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, Mail, Calendar, Shield } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    isDeletingAccount,
    deleteAccount,
  } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [enableDelete, setEnableDelete] = useState(false);

  const handleInputChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file)
      return toast.error("An unexpected error happened, try again later! 😒");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const deleteMyAccount = async (e) => {
    e.preventDefault();
    await deleteAccount();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Photo Section */}
      <div className="relative">
        <div className="h-80 bg-blue-300 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Profile Picture and Name Section */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative -mt-20 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={selectedImage || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-2 right-2 bg-white hover:bg-gray-50 p-3 rounded-full cursor-pointer shadow-lg border transition-all duration-200 ${
                    isUpdatingProfile
                      ? "animate-pulse pointer-events-none"
                      : "hover:scale-105"
                  }`}
                >
                  <Camera className="w-5 h-5 text-gray-600" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleInputChange}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>

              {/* Name and Status */}
              <div className="text-center sm:text-left mb-4 mt-0 md:mt-20">
                <h1 className="text-3xl font-black text-blue-800 mb-2 mt-4">
                  {authUser.fullName}
                </h1>
                <p className="text-gray-600 mb-3">
                  {isUpdatingProfile ? (
                    <span className="flex items-center gap-2 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating profile...
                    </span>
                  ) : (
                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                About
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {authUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Member since</p>
                    <p className="font-medium text-gray-900">
                      {authUser.createdAt?.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Account Settings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Account Settings
              </h2>

              {/* Profile Update Status */}
              {!isUpdatingProfile ? (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Click the camera icon on your profile picture to update your
                    photo
                  </p>
                </div>
              ) : null}

              {/* Delete Account Section */}
              <div className="border-t pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-red-800">
                      Delete Account
                    </h3>
                  </div>

                  <p className="text-sm text-red-700 mb-4">
                    This action cannot be undone. Your account and all
                    associated data will be permanently deleted.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-800 mb-2">
                        Type{" "}
                        <span className="font-bold bg-red-100 px-2 py-1 rounded">
                          sudo delete account
                        </span>{" "}
                        to confirm
                      </label>
                      <input
                        type="text"
                        placeholder="sudo delete account"
                        className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        onChange={(e) =>
                          e.target.value === "sudo delete account"
                            ? setEnableDelete(true)
                            : setEnableDelete(false)
                        }
                      />
                    </div>

                    <button
                      onClick={deleteMyAccount}
                      disabled={!enableDelete}
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                        enableDelete
                          ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isDeletingAccount ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </span>
                      ) : (
                        "Delete Account"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
