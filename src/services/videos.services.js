import { videoModel } from "../models/index.js";

const findOneQuery = async (filter, projection) => {
  const data = await videoModel.findById(filter, projection);
  return data;
};

const insertOneQuery = async (data) => {
  const newObj = new videoModel(data);
  const saveData = await newObj.save();
  return saveData;
};

const deleteOneQuery = async (query) => {
  const deleteData = await videoModel.deleteOne(query);
  return deleteData;
};

export default { findOneQuery, insertOneQuery, deleteOneQuery };
