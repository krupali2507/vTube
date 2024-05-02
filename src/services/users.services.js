import { userModel } from "../models/index.js";

const findOneQuery = async (filter, projection) => {
  projection = projection ? projection : {};
  const userData = await userModel.findOne(filter);
  return userData;
};

const insertOneQuery = async (payload) => {
  let saveInDB = await userModel.create(payload);
  return saveInDB;
};

export default { findOneQuery, insertOneQuery };
