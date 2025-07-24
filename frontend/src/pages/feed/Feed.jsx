/* eslint-disable react/prop-types */
import { useEffect, useCallback, useRef } from "react";
import Post from "./Post";
import Modal from "../../components/Modal";
import NewPostForm from "./NewPostForm";
import { useAuthStore } from "../../store/useAuthStore";
import { usePostStore } from "../../store/usePostStore";
import SmallLoader from "../../components/Loader/SmallLoader";
import { ArrowBigUp, Plus } from "lucide-react";

export default function Feed() {
  const {
    posts,
    getAllPosts,
    isGettingPosts,
    isLoadingMore,
    newPostAlert,
    removeNewPostAlert,
    isNewPostOpen,
    setIsNewPostOpen,
    newPosts,
    hasLoadedInitialPosts,
    setNewPostAlert,
    loadMorePosts,
    hasMore,
  } = usePostStore();

  const { authUser } = useAuthStore();
  const loadMoreRef = useRef(null);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isGettingPosts
        ) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef?.current);
    };
  }, [hasMore, isLoadingMore, isGettingPosts, loadMorePosts]);

  useEffect(() => {
    if (authUser && !hasLoadedInitialPosts) {
      getAllPosts();
    }
  }, [getAllPosts, authUser, hasLoadedInitialPosts]);

  useEffect(() => {
    if (newPosts.length > 0) setNewPostAlert(true);
  }, [newPosts.length, setNewPostAlert]);

  const handleNewPostsClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    removeNewPostAlert();
  }, [removeNewPostAlert]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post Card */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt="Your profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <button
            onClick={() => setIsNewPostOpen(true)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-left text-gray-500 transition-colors"
          >
            What's on your mind, {authUser?.fullName?.split(" ")[0]}?
          </button>
        </div>
        <div className="border-t pt-3 flex items-center justify-around">
          <button
            onClick={() => setIsNewPostOpen(true)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <Plus className="w-5 h-5 text-green-500" />
            Create Post
          </button>
        </div>
      </div>

      {/* New Posts Alert */}
      {newPostAlert && newPosts.length > 0 && (
        <button
          onClick={handleNewPostsClick}
          className="fixed left-1/2 transform -translate-x-1/2 top-20 z-50 text-white px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-all animate-bounce flex items-center gap-2"
          style={{ backgroundColor: "#4633BD" }}
        >
          <ArrowBigUp className="w-5 h-5 animate-pulse" />
          {newPosts.length} New {newPosts.length === 1 ? "Post" : "Posts"}
        </button>
      )}

      {/* Posts Display */}
      {isGettingPosts && !posts.length ? (
        <div className="flex justify-center items-center py-10">
          <SmallLoader />
        </div>
      ) : !Array.isArray(posts) || posts.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl font-medium text-gray-800 mb-2">No posts yet</p>
          <p className="text-gray-500 mb-4">Be the first to share something!</p>
          <button
            onClick={() => setIsNewPostOpen(true)}
            className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: "#4633BD" }}
          >
            Create your first post
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="py-4 text-center">
            {isLoadingMore && <SmallLoader />}
            {!hasMore && posts.length > 0 && (
              <p className="text-sm text-gray-500 bg-white rounded-lg p-4 shadow-sm border">
                You're all caught up! No more posts to load.
              </p>
            )}
          </div>
        </>
      )}

      <Modal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        title="Create New Post"
      >
        <NewPostForm onClose={() => setIsNewPostOpen(false)} />
      </Modal>
    </div>
  );
}
