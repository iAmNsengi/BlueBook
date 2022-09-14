import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import SearchForm from "./SearchForm";
import SidebarTop from "./SidebarTop";

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, searchUsers } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const myOnlineUsers = users.filter((user) => onlineUsers.includes(user?._id));

  const filteredUsers = showOnlineOnly ? myOnlineUsers : users;

  const searchForUsers = (e) => {
    e.preventDefault();
    if (searchedUser.trim() === "") return;
    searchUsers(searchedUser);
  };

  return (
    <>
      <SidebarTop
        showOnlineOnly={showOnlineOnly}
        setShowOnlineOnly={setShowOnlineOnly}
        onlineUsers={myOnlineUsers}
      />

      <SearchForm
        searchForUsers={searchForUsers}
        setSearchedUser={setSearchedUser}
      />

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user?._id}
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
          <div className="text-center text-zinc-500 py-4">No Users</div>
        ) : (
          filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No online users
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Sidebar;
