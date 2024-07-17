import { mongoose } from "mongoose";
import { playlistService, videoService } from "../services/index.js";

const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) throw new Error("Playlist name is required!");

    const playlistPayload = {
      name,
      description,
      owner: req.currentUser._id,
    };
    const playlistInfo = await playlistService.insertOneQuery(playlistPayload);

    res.status(200).send({
      message: "Playlist created successfully!",
      data: playlistInfo,
    });
  } catch (error) {
    console.log("🚀 ~ createPlaylist ~ error:", error);
    res.status(400).send({ message: error.message || error });
  }
};

const getUserPlaylists = async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
};

const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;
    if (!playlistId) throw new Error("Please provide playlist Id!");

    const playlistData = await playlistService.findByIdQuery({
      _id: playlistId,
    });
    if (!playlistData) throw new Error("No playlist Found!");

    res.status(200).send({
      message: "Video Data fetched successfully!",
      data: playlistData,
    });
  } catch (error) {
    console.log("🚀 ~ getPlaylistById ~ error:", error);
    res.status(400).send({ message: error.message || error });
  }
};

const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    if (!playlistId) throw new Error("Please provide playlistId!");
    if (!videoId)
      throw new Error(
        "Please provide videoId that you want to add in playlist."
      );

    const playlistData = await playlistService.findByIdQuery({
      _id: playlistId,
    });
    console.log("🚀 ~ addVideoToPlaylist ~ playlistData:", playlistData);
    if (!playlistData) throw new Error("Playlist does not exists!");
    if (playlistData.videos.includes(videoId))
      throw new Error("Video is already added to playlist!");
    const videoData = await videoService.findByIdQuery({
      _id: videoId,
    });
    console.log("🚀 ~ addVideoToPlaylist ~ playlistData:", videoData);
    if (!videoData) throw new Error("Video does not exists!");

    const updatedPlaylistInfo = await playlistService.findByIdAndUpdateQuery(
      playlistId,
      { $addToSet: { videos: videoId } }
    );
    console.log(
      "🚀 ~ addVideoToPlaylist ~ updatedPlaylistInfo:",
      updatedPlaylistInfo
    );

    res.status(200).send({
      message: "Video is added to the Playlist!",
      data: updatedPlaylistInfo,
    });
  } catch (error) {
    res.status(400).send({ message: error.message || error });
  }
};

const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    if (!playlistId) throw new Error("Please provide playlistId!");
    if (!videoId)
      throw new Error(
        "Please provide videoId that you want to remove from playlist."
      );

    const playlistData = await playlistService.findByIdQuery({
      _id: playlistId,
    });
    console.log("🚀 ~ addVideoToPlaylist ~ playlistData:", playlistData);
    if (!playlistData) throw new Error("Playlist does not exists!");
    if (!playlistData.videos.includes(videoId))
      throw new Error("Video is not part of playlist!");
    const videoData = await videoService.findByIdQuery({
      _id: videoId,
    });
    console.log("🚀 ~ addVideoToPlaylist ~ playlistData:", videoData);
    if (!videoData) throw new Error("Video does not exists!");

    const removedVideoFromPlaylist =
      await playlistService.findByIdAndUpdateQuery(playlistId, {
        $pull: { videos: videoId },
      });
    console.log(
      "🚀 ~ addVideoToPlaylist ~ updatedPlaylistInfo:",
      removedVideoFromPlaylist
    );

    res.status(200).send({
      message: "Video is Removed from the Playlist!",
      data: removedVideoFromPlaylist,
    });
  } catch (error) {
    res.status(400).send({ message: error.message || error });
    console.log("🚀 ~ removeVideoFromPlaylist ~ error:", error);
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    if (!playlistId) throw new Error("Please provide playlistId!");

    const playlistData = await playlistService.findByIdQuery({
      _id: playlistId,
    });
    if (!playlistData) throw new Error("Playlist does not exists!");

    await playlistService.deleteOneQuery({ _id: playlistId });
    res.status(200).send({
      message: "Playlist deleted successfully!",
    });
  } catch (error) {
    console.log("🚀 ~ deletePlaylist ~ error:", error);
    res.status(400).send({ message: error.message || error });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    if (!playlistId) throw new Error("Please provide playlistId!");

    const playlistData = await playlistService.findByIdQuery({
      _id: playlistId,
    });
    if (!playlistData) throw new Error("Playlist does not exists!");

    const updatedPlaylist = await playlistService.findByIdAndUpdateQuery(
      playlistId,
      { name, description }
    );

    res.status(200).send({
      message: "Playlist updated successfully!",
      data: updatedPlaylist,
    });
  } catch (error) {
    console.log("🚀 ~ updatePlaylist ~ error:", error);
    res.status(400).send({ message: error.message || error });
  }
};

export default {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
