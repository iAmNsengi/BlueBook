/* eslint-disable react/prop-types */
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { useState, memo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Initialize the relativeTime plugin
dayjs.extend(relativeTime);

const Post = memo(
  ({ post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleLike = () => {
      setIsLiked((prev) => !prev);
      // Here you can add your API call to update likes
    };

    const handleSave = () => {
      setIsSaved((prev) => !prev);
      // Here you can add your API call to update saves
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className={`btn btn-ghost btn-circle ${
                  isLiked ? "text-red-500" : ""
                }`}
                onClick={handleLike}
              >
                <Heart
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isLiked ? "fill-current" : ""
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
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the post content changes
    return (
      prevProps.post.id === nextProps.post.id &&
      prevProps.post.content === nextProps.post.content &&
      prevProps.post.image === nextProps.post.image
    );
  }
);

Post.displayName = "Post"; // For better debugging
export default Post;
