/* eslint-disable react/prop-types */
import { Loader2 } from "lucide-react";
import { useEffect, useCallback, useRef } from "react";
import Post from "./Post";
import Modal from "../../components/Modal";
import NewPostForm from "./NewPostForm";
import { useAuthStore } from "../../store/useAuthStore";
import { usePostStore } from "../../store/usePostStore";

const Feed = () => {
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

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isLoadingMore, isGettingPosts, loadMorePosts]);

  useEffect(() => {
    if (authUser && !hasLoadedInitialPosts) {
      getAllPosts();
    }
  }, [getAllPosts, authUser, hasLoadedInitialPosts]);

  useEffect(() => {
    if (newPosts.length > 0) {
      setNewPostAlert(true);
    }
  }, [newPosts.length, setNewPostAlert]);

  const handleNewPostsClick = useCallback(() => {
    console.log("Loading new posts");
    removeNewPostAlert();
  }, [removeNewPostAlert]);

  return (
    <div className="relative">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* New Post Button and New Posts Alert */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsNewPostOpen(true)}
            className="btn btn-primary"
          >
            Create New Post
          </button>

          {newPostAlert && newPosts.length > 0 && (
            <button
              onClick={handleNewPostsClick}
              className="btn btn-accent flex items-center gap-2 animate-bounce"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              {newPosts.length} New {newPosts.length === 1 ? "Post" : "Posts"}{" "}
              Available
            </button>
          )}
        </div>

        {/* Posts Display */}
        {isGettingPosts && !posts.length ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin size-20" />
          </div>
        ) : !Array.isArray(posts) || posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm opacity-70">
              Be the first to share something!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="py-4 text-center">
              {isLoadingMore && (
                <Loader2 className="animate-spin mx-auto size-6" />
              )}
              {!hasMore && posts.length > 0 && (
                <p className="text-sm text-gray-500">No more posts to load</p>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        title="Create New Post"
      >
        <NewPostForm onClose={() => setIsNewPostOpen(false)} />
      </Modal>
    </div>
  );
};

export default Feed;
