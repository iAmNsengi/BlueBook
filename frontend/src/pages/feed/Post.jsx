/* eslint-disable react/prop-types */
import { Bookmark, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useState, memo, useCallback, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";

// Initialize the relativeTime plugin
dayjs.extend(relativeTime);

const Post = memo(
  ({ post }) => {
    const { authUser } = useAuthStore();
    const { likePost } = usePostStore();
    const [isLiked, setIsLiked] = useState(
      post?.likes?.includes(authUser?._id) || false
    );
    const [likesCount, setLikesCount] = useState((post?.likes || []).length);
    const [isSaved, setIsSaved] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState("");
    const commentInputRef = useRef(null);

    const handleLike = useCallback(async () => {
      try {
        const result = await likePost(post._id);
        if (result) {
          setIsLiked(result.isLiked);
          setLikesCount(result.likes);
        }
      } catch (error) {
        console.error("Error handling like:", error);
      }
    }, [post._id, likePost]);

    const handleSave = () => {
      setIsSaved((prev) => !prev);
    };

    const handleCommentClick = () => {
      setShowComments(!showComments);
      if (!showComments) {
        setTimeout(() => {
          commentInputRef.current?.focus();
        }, 100);
      }
    };

    const handleSubmitComment = async (e) => {
      e.preventDefault();
      if (!comment.trim()) return;

      try {
        // Add comment logic here once we implement the backend
        setComment("");
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    };

    return (
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={post?.author?.profilePic || "/avatar.png"}
                  alt={post?.authorName}
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {post?.authorName || "Anonymous"}
              </h3>
              <p className="text-xs opacity-70">
                {post?.createdAt ? dayjs(post.createdAt).fromNow() : "Just now"}
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-circle">⋮</button>
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
          <div className="flex justify-between">
            <div className="flex place-items-start gap-4">
              <button
                className={`btn btn-ghost btn-circle ${
                  isLiked ? "text-red-500" : ""
                }`}
                onClick={handleLike}
              >
                <div className="flex flex-col items-center">
                  <Heart
                    className={`h-6 w-6 transition-colors duration-200 ${
                      isLiked ? "fill-current" : ""
                    }`}
                  />
                  {likesCount > 0 && (
                    <span className="text-xs font-medium">{likesCount}</span>
                  )}
                </div>
              </button>
              <button
                className={`btn btn-ghost btn-circle ${
                  showComments ? "text-primary" : ""
                }`}
                onClick={handleCommentClick}
              >
                <MessageCircle className="h-6 w-6" />
              </button>
              <button className="btn btn-ghost btn-circle">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
            <button
              className={`btn btn-ghost btn-circle ${
                isSaved ? "text-yellow-500" : ""
              }`}
              onClick={handleSave}
            >
              <Bookmark
                className={`h-6 w-6 transition-colors duration-200 ${
                  isSaved ? "fill-current" : ""
                }`}
              />
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 border-t pt-4">
              {/* Comments List */}
              <div className="max-h-60 overflow-y-auto mb-4">
                {post?.comments?.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-2 mb-3">
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          <img
                            src={comment.sender?.profilePic || "/avatar.png"}
                            alt="user"
                          />
                        </div>
                      </div>
                      <div className="flex-1 bg-base-200 rounded-lg p-2">
                        <p className="text-sm font-semibold">
                          {comment.sender?.username || "User"}
                        </p>
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No comments yet
                  </p>
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input input-bordered flex-1"
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-circle"
                  disabled={!comment.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.post._id === nextProps.post._id &&
      prevProps.post.content === nextProps.post.content &&
      prevProps.post.image === nextProps.post.image &&
      prevProps.post.likes?.length === nextProps.post.likes?.length
    );
  }
);

Post.displayName = "Post";
export default Post;
