import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User matching id is required"],
    },
    authorName: { type: String, required: [true, "author name is required"] },
    content: {
      type: String,
      required: false,
    },
    image: { type: String, required: false },
    comments: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
      {
        comment: { type: String },
      },
    ],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
