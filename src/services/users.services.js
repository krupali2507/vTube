import { userModel } from "../models/index.js";

const findByIdQuery = async (filter) => {
  const data = await userModel.findById(filter);
  console.log("🚀 ~ findByIdQuery ~ data:", data);
  return data;
};

const findOneQuery = async (filter, projection) => {
  projection = projection ? projection : {};
  const userData = await userModel.findOne(filter);
  return userData;
};

const insertOneQuery = async (payload) => {
  let saveInDB = await userModel.create(payload);
  return saveInDB;
};

const findByIdAndUpdateQuery = async (id, update) => {
  const updateData = await userModel.findByIdAndUpdate(id, update, {
    new: true,
  });
  return updateData;
};

const findAggregateQuery = async (filter, userId) => {
  console.log("🚀 ~ findAggregateQuery ~ userId:", userId);
  console.log("🚀 ~ findAggregateQuery ~ filter:", filter);
  const result = await userModel.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscried To",
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subscried To" },
        isSubscribed: {
          $cond: {
            if: { $in: [userId, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        password: 0,
        createdAt: 0,
        updatedAt: 0,
        refreshToken: 0,
        subscribers: 0,
        "subscried To": 0,
      },
    },
  ]);
  if (!result?.length) throw new Error("Channel does not exists");
  console.log("🚀 ~ findAggregateQuery ~ result:", JSON.stringify(result));
  return result;
};

export default {
  findByIdQuery,
  findOneQuery,
  insertOneQuery,
  findByIdAndUpdateQuery,
  findAggregateQuery,
};
