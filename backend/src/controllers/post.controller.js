import Post from "../models/post.model.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort("createdAt");
    return res.status(200).json(posts);
  } catch (error) {
    console.log(
      "An internal server error occured in getAllPosts",
      error.message
    );
    return res.status(500).json({
      message: `An internal server error occurred in getAllPosts, ${error.message}`,
    });
  }
};
