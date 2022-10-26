import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt");
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

export const createPost = async (req, res) => {
  const loggedInUserId = req?.user?._id;

  const conversations = await Message.find({
    $or: [
      {
        senderId: loggedInUserId,
      },
      {
        receiverId: loggedInUserId,
      },
    ],
  })
    .sort("-createdAt")
    .select("senderId receiverId");

  const usersWeChat = [
    ...new Set(
      conversations.flatMap((convo) => [
        convo.senderId.toString(),
        convo.receiverId.toString(),
      ])
    ),
  ].filter((id) => id !== loggedInUserId.toString());

  try {
    const { content, image } = req.body;
    const userId = req.user?._id;
    let uploadedImageURL;

    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);
      uploadedImageURL = uploadResult.secure_url;
    }
    const author = await User.findById(userId);

    if (!author) return res.status(400).json({ message: "Author not found" });

    const newPost = new Post({
      author,
      authorName: author?.fullName,
      content: content.trim(),
      image: uploadedImageURL,
    });
    await newPost.save();

    io.emit(usersWeChat, "newPost");

    return res.status(201).json({ message: "Post added successfully" });
  } catch (error) {
    console.log(
      "An internal server error occured in create Post",
      error.message
    );
    return res.status(500).json({
      message: `An internal server error occurred in create post, ${error.message}`,
    });
  }
};
