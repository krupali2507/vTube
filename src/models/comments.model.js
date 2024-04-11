import mongoose from "mongoose";

const commentSchema = mongoose.Schema({}, {});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
