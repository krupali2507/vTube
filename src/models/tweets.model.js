import mongoose from "mongoose";

const tweetSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;
