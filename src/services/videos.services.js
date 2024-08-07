import { videoModel } from "../models/index.js";

const findByIdQuery = async (filter, projection) => {
  const data = await videoModel.findById(filter, projection);
  return data;
};

const findAllQuery = async (filter, Query, projection) => {
  const { limit, skip, sortBy } = Query;
  const data = await videoModel
    .find(filter, projection)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
  return data;
};

const insertOneQuery = async (data) => {
  const newObj = new videoModel(data);
  const saveData = await newObj.save();
  return saveData;
};

const updateOneQuery = async (filter, update) => {
  const updatedData = await videoModel.findByIdAndUpdate(filter, update, {
    new: true,
  });
  return updatedData;
};

const deleteOneQuery = async (query) => {
  const deleteData = await videoModel.deleteOne(query);
  return deleteData;
};

export default {
  findByIdQuery,
  findAllQuery,
  insertOneQuery,
  updateOneQuery,
  deleteOneQuery,
};
