/* eslint-disable react/prop-types */
import { Bookmark, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useState, memo, useCallback, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

// Initialize the relativeTime plugin
dayjs.extend(relativeTime);

const Post = memo(
  ({ post }) => {
    const { authUser } = useAuthStore();
    const { likePost, addComment } = usePostStore();
    const [isLiked, setIsLiked] = useState(
      post?.likes?.includes(authUser?._id)
    );
    const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
    const [isSaved, setIsSaved] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(post?.comments || []);
    const commentInputRef = useRef(null);
    const commentsEndRef = useRef(null);

    const handleLike = useCallback(async () => {
      // Optimistic update
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => prev + (isLiked ? -1 : 1));

      try {
        const result = await likePost(post._id);
        // If the server response differs from our optimistic update
        console.log(result);

        if (result.isLiked !== !isLiked) {
          setIsLiked(result.isLiked);
          setLikesCount(result.likes);
        }
        // TODO: Emit socket event for real-time updates
        // socket.emit('postLike', { postId: post._id, isLiked: result.isLiked });
      } catch (error) {
        // Revert optimistic update on error
        console.log(error);
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => prev + (isLiked ? 1 : -1));
        toast.error("Failed to update like");
      }
    }, [post._id, isLiked, likePost]);

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

      // Create temporary comment with all required fields
      const tempComment = {
        _id: `temp-${Date.now()}`,
        sender: {
          _id: authUser._id,
          fullName: authUser.fullName,
          profilePic: authUser.profilePic,
        },
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        isTemp: true,
      };

      // Optimistic update
      setComments((prev) => [...prev, tempComment]);
      setComment(""); // Clear input immediately

      try {
        const result = await addComment(post._id, comment.trim());
        // Update the temporary comment with server data while maintaining position
        setComments((prev) =>
          prev.map((c) =>
            c._id === tempComment._id
              ? { ...result.newComment, isTemp: false }
              : c
          )
        );

        // Scroll to the bottom of the comments container
        commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.log(error);
        // Keep the comment but mark it as failed
        setComments((prev) =>
          prev.map((c) =>
            c._id === tempComment._id ? { ...c, failed: true } : c
          )
        );
        toast.error("Failed to post comment");
      }
    };

    // useEffect(() => {
    //   socket.on('postLikeUpdate', handleLikeUpdate);
    //   socket.on('newCommentUpdate', handleCommentUpdate);
    //   return () => {
    //     socket.off('postLikeUpdate');
    //     socket.off('newCommentUpdate');
    //   };
    // }, []);

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
                <div className="flex flex-col">
                  <MessageCircle className="h-6 w-6" />
                  {comments?.length > 0 && (
                    <span className="text-xs font-medium">
                      {comments.length}
                    </span>
                  )}
                </div>
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
              <div className="max-h-60 overflow-y-auto mb-4">
                {comments && comments.length > 0 ? (
                  comments.map(
                    (comment) =>
                      comment &&
                      comment.sender && (
                        <div
                          key={comment._id}
                          className={`flex items-start gap-2 mb-3 ${
                            comment.isTemp ? "opacity-50" : ""
                          } ${comment.failed ? "bg-red-50" : ""}`}
                        >
                          <div className="avatar">
                            <div className="w-8 h-8 rounded-full">
                              <img
                                src={
                                  comment.sender?.profilePic || "/avatar.png"
                                }
                                alt={comment.sender?.fullName || "User"}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 bg-base-200 rounded-lg p-2">
                            <p className="text-sm font-semibold">
                              {comment.sender?.fullName || "Anonymous"}
                            </p>
                            <p className="text-sm">{comment.comment}</p>
                            {comment.failed && (
                              <p className="text-xs text-red-500">
                                Failed to post - tap to retry
                              </p>
                            )}
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No comments yet
                  </p>
                )}
                <div ref={commentsEndRef} />
              </div>

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
    return prevProps.post._id === nextProps.post._id;
  }
);

Post.displayName = "Post";
export default Post;
