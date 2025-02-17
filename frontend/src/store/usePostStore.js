import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import { BASE_URL } from ".";

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
    if (!isLoadMore) set({ isGettingPosts: !get().hasLoadedInitialPosts });
    else set({ isLoadingMore: true });

    try {
      const currentPage = isLoadMore ? get().page : 1;
      const res = await axiosInstance.get(`/posts?page=${currentPage}&limit=5`);

      set((state) => ({
        posts: isLoadMore ? [...state.posts, ...res.data.data] : res.data.data,
        hasMore: res?.data?.data.length === 5,
        page: currentPage + 1,
        hasLoadedInitialPosts: true,
        ...(!isLoadMore && {
          newPosts: [],
          newPostAlert: false,
          lastViewedAt: Date.now(),
        }),
      }));
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
