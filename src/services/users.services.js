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

export default { findByIdQuery, findOneQuery, insertOneQuery };
