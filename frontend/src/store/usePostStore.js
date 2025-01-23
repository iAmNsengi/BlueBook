import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://vuga-backend.onrender.com";

export const usePostStore = create((set, get) => ({
  socket: null,
  isGettingPosts: false,
  isCreatingNewPost: false,
  newPostAlert: false,

  posts: [],
  isFindingPosts: false,

  getAllPosts: async () => {
    set({ isGettingPosts: true });
    try {
      const res = await axiosInstance.get("/posts");
      set({ posts: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("An error occurred in Get all posts", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingPosts: false });
    }
  },
  createPost: async (data) => {
    set({ isCreatingNewPost: true });
    try {
      const res = await axiosInstance.post("/posts/add", data);
      set({ posts: [...get().posts, res.data] });
      
      toast.success("Post added successfully");
    } catch (error) {
      console.error("Error in create Post", error);
      return toast.error(error.response.data.message);
    } finally {
      set({ isCreatingNewPost: false });
    }
  },
  removeNewPostAlert: () => {
    set({ newPostAlert: false });
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

    socket.on("newPost", (post) => {
      set({ newPostAlert: true });
      toast.success("A new post just arrived");
      set({ posts: [...get().posts, post] });
    });
  },
}));
