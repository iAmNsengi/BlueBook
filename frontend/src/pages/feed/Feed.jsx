import { MessageCircle, ThumbsUp } from "lucide-react";
import { formatMessageTime } from "../../lib/utils";
import { usePostStore } from "../../store/usePostStore";

const Feed = () => {
  const { posts } = usePostStore();
  return (
    <div className="p-4">
      {posts.map((post) => {
        <div className="grid grid-cols-1 gap-4">
          <div className="card bg-base-100 shadow-lg transition-transform transform hover:scale-105">
            <div className="card-header flex items-center p-4 border-b">
              <img
                src={post?.author?.profilePic || "avatar.png"}
                alt={post?.author?.fullName}
                className="rounded-full mr-2"
              />
              <div>
                <h2 className="font-bold">{post?.author?.fullName} </h2>
                <p className="text-sm text-gray-500">
                  {formatMessageTime(post?.createdAt)}{" "}
                </p>
              </div>
            </div>
            {post?.image && (
              <img
                src={post?.image}
                alt="Post Image"
                className="w-full rounded-t-lg"
              />
            )}
            <div className="card-body p-4">
              {post?.content && <div>{post?.content} </div>}
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary">
                  <ThumbsUp />{" "}
                </button>
                <button className="btn btn-secondary">
                  <MessageCircle />{" "}
                </button>
              </div>
            </div>
          </div>
        </div>;
      })}
    </div>
  );
};

export default Feed;
