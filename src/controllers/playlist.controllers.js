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
  const { playlistId } = req.params;
  //TODO: get playlist by id
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
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
};

const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
};

const updatePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
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
