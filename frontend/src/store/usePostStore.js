import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import { BASE_URL } from ".";

const CACHE_KEY = "postCache";
const CACHE_TIMESTAMP_KEY = "postCacheTimestamp";
const CACHE_DURATION = 5 * 60 * 1000;

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

  getCachedPosts: () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (!cachedData || !timestamp) return null;

      // Check if cache is still valid
      const isExpired = Date.now() - parseInt(timestamp) > CACHE_DURATION;
      if (isExpired) {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        return null;
      }

      return JSON.parse(cachedData);
    } catch (error) {
      console.error("Error reading cache:", error);
      return null;
    }
  },

  setCachedPosts: (posts) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(posts));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  },

  getAllPosts: async (isLoadMore = false) => {
    if (!isLoadMore) {
      // Try to load cached posts first
      const cachedPosts = get().getCachedPosts();
      if (cachedPosts) {
        set({
          posts: cachedPosts,
          hasLoadedInitialPosts: true,
          isGettingPosts: false,
        });
      } else {
        set({ isGettingPosts: !get().hasLoadedInitialPosts });
      }
    } else {
      set({ isLoadingMore: true });
    }

    try {
      const currentPage = isLoadMore ? get().page : 1;
      const lastPostDate = !isLoadMore && get().posts[0]?.createdAt;

      const res = await axiosInstance.get("/posts", {
        params: {
          page: currentPage,
          limit: 5,
          after: lastPostDate, // Send the timestamp of the most recent post
        },
      });

      const newPosts = res.data.data;

      set((state) => {
        const updatedPosts = isLoadMore
          ? [...state.posts, ...newPosts]
          : lastPostDate
          ? [...newPosts, ...state.posts]
          : newPosts;

        // Cache the updated posts
        get().setCachedPosts(updatedPosts);

        return {
          posts: updatedPosts,
          hasMore: newPosts.length === 5,
          page: currentPage + 1,
          hasLoadedInitialPosts: true,
          ...(lastPostDate
            ? {}
            : {
                newPosts: [],
                newPostAlert: false,
                lastViewedAt: new Date().toISOString(),
              }),
        };
      });
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
    if (!state.isLoadingMore && state.hasMore) state.getAllPosts(true);
  },

  createPost: async (postData) => {
    try {
      set({ isCreatingNewPost: true });

      if (postData.image) {
        const imageSizeInMB = (postData.image.length * 0.75) / 1024 / 1024;
        if (imageSizeInMB > 5)
          throw new Error("Image size should be less than 5MB");
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
      } else throw new Error(response.data.message || "Failed to create post");
    } catch (error) {
      console.error("Create post error:", error);
      throw error;
    } finally {
      set({ isCreatingNewPost: false });
    }
  },
  removeNewPostAlert: () => {
    set((state) => {
      // Merge new posts at the beginning of the posts array
      const updatedPosts = [...(state.newPosts || []), ...(state.posts || [])];
      return {
        posts: updatedPosts,
        newPosts: [],
        newPostAlert: false,
        lastViewedAt: Date.now(),
      };
    });
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

    socket.on("newPost", (post) => {
      console.log("Received new post:", post);
      set((state) => {
        // Don't add duplicate posts
        if (
          state.newPosts.some((p) => p._id === post._id) ||
          state.posts.some((p) => p._id === post._id)
        ) {
          return state;
        }
        return {
          newPosts: [post, ...(state.newPosts || [])],
          newPostAlert: true,
        };
      });
    });

    socket.on("postLike", (post) => {
      console.log("A post was liked", post);
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
      page: 1,
      hasMore: true,
    });
  },
  setNewPostAlert: (value) => {
    set({ newPostAlert: value });
  },
  likePost: async (postId) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/like`);
      console.log(response.data);

      if (response.data.success) {
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: response.data.data.isLiked
                    ? [...post.likes, useAuthStore.getState().authUser._id]
                    : post.likes.filter(
                        (id) => id !== useAuthStore.getState().authUser._id
                      ),
                }
              : post
          ),
        }));
        return response.data.data;
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  },
  addComment: async (postId, comment) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comments`, {
        comment,
      });

      if (response.data.success) {
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: [...(post.comments || []), response.data.data],
                }
              : post
          ),
        }));
        return response.data.data;
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  },
  deletePost: async (postId) => {
    try {
      const response = await axiosInstance.delete(`/posts/${postId}`);
      if (response.data.success) {
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete your post");
    }
  },
}));
