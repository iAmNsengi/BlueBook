import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://vuga-backend.onrender.com";

export const usePostStore = create((set, get) => ({
  socket: null,
  isGettingPosts: false,
  isCreatingNewPost: false,
  newPostAlert: false,
  isNewPostOpen: false,

  posts: [],
  isFindingPosts: false,

  newPosts: [],

  getAllPosts: async () => {
    set({ isGettingPosts: true });
    try {
      const res = await axiosInstance.get("/posts");
      console.log("Fetched posts:", res.data);
      set({
        posts: res.data.data,
        newPosts: [],
        newPostAlert: false,
      });
      get().connectSocket();
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error(error.response?.data?.message || "Error fetching posts");
    } finally {
      set({ isGettingPosts: false });
    }
  },
  createPost: async (postData) => {
    try {
      set({ isCreatingNewPost: true });

      if (postData.image) {
        const imageSizeInMB = (postData.image.length * 0.75) / 1024 / 1024;
        if (imageSizeInMB > 5) {
          throw new Error("Image size should be less than 5MB");
        }
      }

      const response = await axiosInstance.post("/posts/add", {
        content: postData.content || "",
        image: postData.image || null,
      });

      if (response.data.success) {
        set((state) => ({
          posts: [response.data.data, ...(state.posts || [])],
        }));
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Create post error:", error);
      throw error;
    } finally {
      set({ isCreatingNewPost: false });
    }
  },
  removeNewPostAlert: () => {
    console.log("Removing new post alert");
    set((state) => ({
      newPostAlert: false,
      posts: [...(state.newPosts || []), ...(state.posts || [])],
      newPosts: [],
    }));
  },
  connectSocket: () => {
    const authUser = useAuthStore.getState().authUser;
    console.log("Attempting to connect socket for user:", authUser?._id);

    if (!authUser || get().socket?.connected) {
      console.log(
        "Socket connection skipped:",
        !authUser ? "No auth user" : "Already connected"
      );
      return;
    }

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
      set({ socket });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("newPost", (post) => {
      console.log("Received new post:", post);
      set((state) => ({
        newPostAlert: true,
        newPosts: [...(state.newPosts || []), post],
      }));
    });

    socket.connect();
  },
  setIsNewPostOpen: (value) => set({ isNewPostOpen: value }),
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      console.log("Disconnecting socket");
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
