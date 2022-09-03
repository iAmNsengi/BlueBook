import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const {
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    searchUsers,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  let filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user?._id))
    : users;

  const searchForUsers = (e) => {
    e.preventDefault();
    searchUsers(searchedUser);
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5 flex gap-4">
        <Users className="size-6" />
        <span className="font-medium hidden lg:block">Contacts</span>
      </div>
      <div className="mt-3 px-3 hidden lg:flex items-center gap-2">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
          />
          <span className="text-sm">Show Online Only</span>
        </label>
        <span className="text-xs text-zinc-500">
          ( {onlineUsers.length - 1} online)
        </span>
      </div>
      <form
        className="mt-3 px-3 hidden lg:flex items-center border"
        onSubmit={searchForUsers}
      >
        <input
          type="text"
          checked={showOnlineOnly}
          className="input input-bordered "
          placeholder="Search for users..."
          onChange={(e) => setSearchedUser(e.target.value)}
        />
        <button className="btn btn-primary">
          <Search />
        </button>
      </form>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user?._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user?.profilePic || "avatar.png"}
                alt={user?.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user?._id) && (
                <span className="absolute top-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user?.fullName} </div>
              <div className="text-xs text-zinc-400">
                {onlineUsers.includes(user?._id) ? (
                  <span className="text-green-600">Online</span>
                ) : (
                  <span className="text-red-600">Offline</span>
                )}
              </div>
            </div>
          </button>
        ))}

        {users.length === 0 ? (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        ) : (
          filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
