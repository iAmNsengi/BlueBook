import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";

import { axiosInstance } from "../lib/axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://vuga-backend.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  authToken: null,

  isLoading: false,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isDeletingAccount: false,
  isCheckingAuth: true,
  socket: null,

  onlineUsers: [],
  isFindingAllUsers: false,
  allUsers: [],

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

  loginWithGoogle: async (data) => {
    if (data) set({ isSigningUp: true, isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/google", data);
      if (!res?.data) return toast.error("Failed to signup with Google");
      const { token, user } = res.data.data;
      set({ authUser: user, authToken: token });
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      await get().checkAuth();
      toast.success(`Welcome back ${user?.fullName} 😊`);
      await get().connectSocket();
    } catch (error) {
      console.log("Error in login with Google", error);
    } finally {
      set({ isSigningUp: false, isLoggingIn: false });
    }
  },

  forgotPassword: async (data) => {
    if (data) set({ isLoading: true });
    try {
      await axiosInstance.post("/auth/forgot-password", data);
      toast.success(
        "Password reset email sent, check your email to proceed with password reset!"
      );
    } catch (error) {
      if (error.status === 404)
        return toast.error(
          "User with email wasnot found, try creating an account"
        );
      toast.error(error?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (data) => {
    if (data) set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if (!res.data?.data) throw new Error("Invalid response format");
      const { user, token } = res.data.data;
      set({ authUser: user, authToken: token });
      await get().checkAuth();
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      if (user) toast.success("Account created successfully!");
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
      set({ authUser: null, authToken: null });
      delete axiosInstance.defaults.headers.common["Authorization"];
      toast.success(`Until we meet again ${currentUser.fullName} 👌`);
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout", error);
      toast.error(error.response.data.data.message);
    }
  },

  login: async (data) => {
    if (data) set({ isLoggingIn: true });
    try {
      set({ authUser: null });
      const res = await axiosInstance.post("/auth/login", data);
      if (!res.data?.data) throw new Error("Invalid response format");
      const { user, token } = res.data.data;

      if (!user) return toast.error("Invalid response from server");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      set({ authUser: user, authToken: token });
      await get().checkAuth();
      toast.success(`Welcome back ${user?.fullName} 😊`);
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
      get().disconnectSocket();
      toast.success("Sad to see you going, hope you will be back soon 🤗");
    } catch (error) {
      console.error("Error in delete account");
      toast.error(error.response.data.message);
    } finally {
      set({ isDeletingAccount: false });
    }
  },

  getAllUsers: async () => {
    set({ isFindingAllUsers: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ allUsers: res.data });
    } catch (error) {
      console.error("Error occurred in getuser", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isFindingAllUsers: false });
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
