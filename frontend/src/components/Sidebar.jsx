import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const onlineUsers = [];
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5 flex gap-4">
        <Users className="size-6" />
        <span className="font-medium hidden lg:block">Contacts</span>
      </div>
      <div className="flex flex-col">
        {users.map((user) => (
          <div className="flex items-center gap-4 px-4 py-2 hover:bg-base-200 cursor-pointer">
            <img
              src={user.profilePic || "avatar.png"}
              className="size-10 rounded-full border"
              alt=""
            />
            {user.fullName}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
