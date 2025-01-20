import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://vuga-backend.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isDeletingAccount: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    if (data) set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      await get().checkAuth();
      if (res?.data) toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      console.log("An internal server error occurred ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      const currentUser = get().authUser;
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success(`Until we meet again ${currentUser.fullName} 👌`);
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout", error);
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    if (data) set({ isLoggingIn: true });
    try {
      set({ authUser: null });
      const res = await axiosInstance.post("/auth/login", data);
      if (!res?.data?._id) return toast.error("Invalid response from server");

      set({ authUser: res.data });
      await get().checkAuth();
      if (res?.data) toast.success(`Welcome back ${res.data.fullName} 😊`);
      get().connectSocket();
    } catch (error) {
      console.log("Error in login", error);
      toast.error(error.response?.data?.message || "Login failed");
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    if (data) set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile picture updated successfully 👌");
    } catch (error) {
      console.error("Error in update profile", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  deleteAccount: async () => {
    set({ isDeletingAccount: true });
    try {
      await axiosInstance.delete("/auth/delete-account");
      set({ authUser: null });
      toast.success("Sad to see you going, hope you will be back soon 🤗");
    } catch (error) {
      console.error("Error in delete account");
      toast.error(error.response.data.message);
    } finally {
      set({ isDeletingAccount: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.connect();
    set({ socket });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
