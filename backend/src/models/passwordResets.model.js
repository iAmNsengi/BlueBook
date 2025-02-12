import mongoose from "mongoose";

const passwordResetsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    token: {
      type: String,
      required: [true, "Token is required for password resets"],
    },
  },
  { timestamps: true }
);
passwordResetsSchema.index({ user: 1 });

const PasswordResets = mongoose.model("PasswordResets", passwordResetsSchema);

export default PasswordResets;
