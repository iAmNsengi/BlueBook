/* eslint-disable react/prop-types */
import { Loader2 } from "lucide-react";
import { useEffect, useCallback, memo } from "react";
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
    newPostAlert,
    removeNewPostAlert,
    isNewPostOpen,
    setIsNewPostOpen,
    connectSocket,
    disconnectSocket,
    newPosts,
  } = usePostStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    console.log("Feed mounted, getting posts");
    if (authUser) {
      getAllPosts();
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [getAllPosts, connectSocket, disconnectSocket, authUser]);

  const handleCloseModal = useCallback(() => {
    setIsNewPostOpen(false);
  }, [setIsNewPostOpen]);

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

          {newPostAlert && (
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

        {isGettingPosts ? (
          <Loader2 className="animate-spin text-center mx-auto size-20" />
        ) : !Array.isArray(posts) || posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm opacity-70">
              Be the first to share something!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isNewPostOpen}
        onClose={handleCloseModal}
        title="Create New Post"
      >
        <NewPostForm onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default memo(Feed);
