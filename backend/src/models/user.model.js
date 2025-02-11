import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email field is required"],
      unique: [true, "User with email already existed"],
    },
    fullName: {
      type: String,
      required: [true, "fullName field is required"],
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    source: {
      type: String,
      select: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
