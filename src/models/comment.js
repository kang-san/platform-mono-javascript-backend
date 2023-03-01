import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    shorts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shorts",
      required: [true, "Shorts is required"],
    },
    user: {
      type: Object,
      required: [true, "User is required"],
    },
    description: {
      type: String,
      required: [true, "Comment description is required"],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;