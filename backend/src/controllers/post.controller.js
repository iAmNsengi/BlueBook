import cloudinary from "../utils/configs/cloudinary.js";
import { io, userSocketMap, notifyNewPost } from "../utils/configs/socket.js";
import Post from "../models/post.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

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

    console.log("Found conversations:", conversations);

    const usersToNotify = [
      ...new Set(
        conversations.flatMap((convo) => [
          convo.senderId.toString(),
          convo.receiverId.toString(),
        ])
      ),
    ].filter((id) => id !== userId.toString());

    console.log("Users to notify:", usersToNotify);

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
