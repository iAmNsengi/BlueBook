import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Loader2, User } from "lucide-react";
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
    <div className="h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-300/80 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold pt-5">
              My Profile <span className="animate-pulse">🤡</span>
            </h1>
            <p className="mt-4">My profile information</p>
          </div>
          {/* avatar upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.profilePic || "/avatar.png"}
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
                <div className="flex gap-2">
                  <Loader2 className="size-5 animate-spin font-bold" />{" "}
                  Uploading...
                </div>
              ) : (
                <span className="border border-primary rounded-xl px-6 py-1 animate-pulse">
                  Click the camera icon to update your profile image 🌄
                </span>
              )}
            </p>
            <div className="space-y-5 py-10 pointer-events-none">
              <div className="flex items-center justify-between gap-40 space-y-1 5">
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

              <div className="py-6 rounded-xl">
                <h2 className="text-xl font-medium mb-4">
                  My account information 🧺
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                    <span>Member since</span>
                    <span>{authUser.createdAt?.split("T")[0]} </span>
                  </div>
                  <div className="flex items-center gap-20 justify-between py-2">
                    <span>Account Status</span>
                    <span className="bg-green-500 px-3 py-2 text-white rounded-xl animate-pulse font-bold">
                      Active{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 w-full mt-4  px-2">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-red-600">
                  Delete Account 🚫
                </h2>
                <form
                  className="flex items-end justify-between py-2 border-zinc-700"
                  onSubmit={deleteMyAccount}
                >
                  <div className="flex flex-col">
                    <span className="flex items-center gap-4 py-2">
                      Type in{" "}
                      <span className="font-bold">sudo delete account</span> to
                      remove your account
                    </span>
                    <input
                      className="input"
                      type="text"
                      placeholder="sudo delete account"
                      onChange={(e) =>
                        e.target.value === "sudo delete account"
                          ? setEnableDelete(true)
                          : setEnableDelete(false)
                      }
                    />
                  </div>

                  <button
                    disabled={!enableDelete}
                    className={`btn bg-red-600 rounded-lg text-white cursor-pointer z-50`}
                  >
                    {isDeletingAccount ? (
                      <>
                        <Loader2 className="size-5 animate-spin font-bold" />{" "}
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
