import Post from "../models/post.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";
import { notifyNewPost } from "../utils/configs/socket.js";
import { retryMiddleware } from "../middlewares/retry.middleware.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const conversations = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    });

    const usersWeChat = [
      ...new Set(
        conversations.flatMap((convo) => [
          convo.senderId.toString(),
          convo.receiverId.toString(),
        ])
      ),
    ].map((id) => new mongoose.Types.ObjectId(id));

    const posts = await Post.find({ author: { $in: usersWeChat } })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("author", "fullName profilePic");

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user._id;

    console.log("Creating post for user:", userId);

    const newPost = await Post.create({
      content,
      image,
      author: userId,
      authorName: req.user.fullName,
    });

    // Find users who chat with the post creator
    const conversations = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    const usersToNotify = [
      ...new Set(
        conversations.flatMap((convo) => [
          convo.senderId.toString(),
          convo.receiverId.toString(),
        ])
      ),
    ].filter((id) => id !== userId.toString());

    // Notify connected users about the new post
    notifyNewPost(newPost, usersToNotify);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating post",
    });
  }
};

export const likePost = retryMiddleware(
  catchAsync(async (req, res, next) => {
    const { post_id } = req.params;
    const post = await Post.findById(post_id);
    if (!post) return next(new AppError("Post with given id wasn't found"));
    let isLiked = false;
    if (post.likes.length) {
      isLiked = post.likes.includes(req.user._id);
      if (isLiked)
        post.likes = post.likes.filter(
          (id) => id.toString() !== req.user._id.toString()
        );
      else post.likes.push(req.user._id);
    } else post.likes.push(req.user._id);

    await post.save();

    res.status(200).json({
      success: true,
      data: {
        likes: post.likes.length,
        isLiked: !isLiked,
      },
    });
  })
);
