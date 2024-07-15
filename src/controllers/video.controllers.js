import { uploadOnCloudinary } from "../utils/index.js";

const postVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) throw new Error("Video title should not be empty!");

    const videoUrl = req.files?.video?.[0]?.path;
    if (!videoUrl) throw new Error("Please select video to upload!");

    const videoLinkUrl = await uploadOnCloudinary(videoUrl);
    console.log("🚀 ~ postVideo ~ videoLinkUrl:", videoLinkUrl);

    res.status(200).send({ message: "Video uploaded successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const getAllVideos = async (req, res) => {
  try {
    res.status(200).send({ message: "Videos fetched successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const getVideoById = async (req, res) => {
  try {
    res.status(200).send({ message: "Video fetch successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const updateVideo = async (req, res) => {
  try {
    res.status(200).send({ message: "Video updated successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    res.status(200).send({ message: "Video deleted successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const togglePublishStatus = async (req, res) => {
  try {
    res.status(200).send({ message: "Video status changed successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

export default {
  postVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
