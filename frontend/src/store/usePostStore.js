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
  isLoadingMore: false,
  isCreatingNewPost: false,
  newPostAlert: false,
  isNewPostOpen: false,
  posts: [],
  newPosts: [],
  hasLoadedInitialPosts: false,
  lastViewedAt: Date.now(),
  page: 1,
  hasMore: true,

  getAllPosts: async (isLoadMore = false) => {
    if (!isLoadMore) {
      set({ isGettingPosts: !get().hasLoadedInitialPosts });
    } else {
      set({ isLoadingMore: true });
    }

    try {
      const currentPage = isLoadMore ? get().page : 1;
      const res = await axiosInstance.get(`/posts?page=${currentPage}&limit=5`);

      set((state) => ({
        posts: isLoadMore ? [...state.posts, ...res.data.data] : res.data.data,
        hasMore: res.data.data.length === 5,
        page: currentPage + 1,
        hasLoadedInitialPosts: true,
        lastViewedAt: Date.now(),
        ...(!isLoadMore && { newPosts: [], newPostAlert: false }),
      }));
      get().connectSocket();
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error(error.response?.data?.message || "Error fetching posts");
    } finally {
      set({
        isGettingPosts: false,
        isLoadingMore: false,
      });
    }
  },

  loadMorePosts: () => {
    const state = get();
    if (!state.isLoadingMore && state.hasMore) {
      state.getAllPosts(true);
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
      lastViewedAt: Date.now(),
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
  resetPostStore: () => {
    set({
      posts: [],
      newPosts: [],
      newPostAlert: false,
      hasLoadedInitialPosts: false,
      socket: null,
      lastViewedAt: Date.now(),
    });
  },
  setNewPostAlert: (value) => {
    set({ newPostAlert: value });
  },
}));
