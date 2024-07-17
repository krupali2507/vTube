import { playlistModel } from "../models/index.js";

const findByIdQuery = async (filter) => {
  const data = await playlistModel.findById(filter);
  return data;
};

const findOneQuery = async (filter, projection) => {
  projection = projection ? projection : {};
  const userData = await playlistModel.findOne(filter);
  return userData;
};

const insertOneQuery = async (payload) => {
  let saveInDB = await playlistModel.create(payload);
  return saveInDB;
};

const findByIdAndUpdateQuery = async (id, update) => {
  const updateData = await playlistModel.findByIdAndUpdate(id, update, {
    new: true,
  });
  return updateData;
};

const findAggregateQuery = async (filter, userId) => {
  const playlistData = await playlistModel.find({});
  return playlistData;
};

const deleteOneQuery = async (filter) => {
  const deleteData = await playlistModel.deleteOne(filter);
  return deleteData;
};

export default {
  findByIdQuery,
  findOneQuery,
  insertOneQuery,
  findByIdAndUpdateQuery,
  findAggregateQuery,
  deleteOneQuery,
};
