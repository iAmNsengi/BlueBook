import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver id is required"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender id is required"],
    },
    text: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

messageSchema.index({ timestamps: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
