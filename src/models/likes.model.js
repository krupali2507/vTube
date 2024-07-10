import mongoose, { mongo } from "mongoose";

const likesSchema = mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    Video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const Like = mongoose.model("Like", likesSchema);

export default Like;
