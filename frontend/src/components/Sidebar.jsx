import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const onlineUsers = [];
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return <div>Sidebar</div>;
};

export default Sidebar;
