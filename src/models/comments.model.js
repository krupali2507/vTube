import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {},
  { timestamps: true, versionKey: false }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
