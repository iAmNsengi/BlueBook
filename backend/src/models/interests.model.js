import mongoose from "mongoose";

const interestsSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "An interest needs a name"] },
  },
  { timestamps: true }
);

interestsSchema.index({ title: 1 });

const Interests = mongoose.model("Interests", interestsSchema);

export default Interests;
