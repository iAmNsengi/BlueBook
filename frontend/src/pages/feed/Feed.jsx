import { Bookmark, Heart, Loader2, MessageCircle, Share2 } from "lucide-react";
import { formatMessageTime } from "../../lib/utils";
import { usePostStore } from "../../store/usePostStore";
import { useEffect, useState } from "react";

const Feed = () => {
  const { posts, getAllPosts, isLoadingPosts } = usePostStore();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleLike = (postId) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const handleSave = (postId) => {
    setSavedPosts((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) newSaved.delete(postId);
      else newSaved.add(postId);
      return newSaved;
    });
  };

  if (isLoadingPosts) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm opacity-70">Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={post?.author?.profilePic || "/avatar.png"}
                      alt={post?.author?.fullName}
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{post?.authorName}</h3>
                  <p className="text-xs opacity-70">
                    {formatMessageTime(post?.createdAt)}
                  </p>
                </div>
              </div>
              <button className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Image */}
            {post?.image && (
              <figure className="relative">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full object-cover max-h-[32rem]"
                  loading="lazy"
                />
              </figure>
            )}

            {/* Content */}
            {post?.content && (
              <div className="p-4 py-10">
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-3 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    className={`btn btn-ghost btn-circle ${
                      likedPosts.has(post.id) ? "text-red-500" : ""
                    }`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart
                      className={`h-6 w-6 transition-colors duration-200 ${
                        likedPosts.has(post.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  <button className="btn btn-ghost btn-circle">
                    <MessageCircle className="h-6 w-6" />
                  </button>
                  <button className="btn btn-ghost btn-circle">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
                <button
                  className={`btn btn-ghost btn-circle ${
                    savedPosts.has(post.id) ? "text-yellow-500" : ""
                  }`}
                  onClick={() => handleSave(post.id)}
                >
                  <Bookmark
                    className={`h-6 w-6 transition-colors duration-200 ${
                      savedPosts.has(post.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
