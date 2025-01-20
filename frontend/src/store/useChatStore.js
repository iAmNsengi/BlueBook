import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isSearchingUsers: false,
  isMessageLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error in getUsers", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error in get messages", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    set({ isSendingMessage: true });
    try {
      const { selectedUser, messages } = get();

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Error in sendMessage", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingMessage: false });
    }
  },
  searchUsers: async (query) => {
    set({ isSearchingUsers: true });
    console.log(query);

    try {
      const res = await axiosInstance.post("/auth/findUsers", {
        search: query,
      });
      set({ users: res.data });
    } catch (error) {
      console.error("Error in sendMessage", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSearchingUsers: false });
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
