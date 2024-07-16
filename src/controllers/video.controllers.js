import { videoService } from "../services/index.js";
import { uploadOnCloudinary } from "../utils/index.js";

const postVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) throw new Error("Video title should not be empty!");

    const videoUrl = req.files?.video?.[0]?.path;
    if (!videoUrl) throw new Error("Please select video to upload!");

    const { URL, Duration } = await uploadOnCloudinary(videoUrl);
    const newVideoObj = {
      title,
      description,
      duration: Duration,
      videoFile: URL,
      owner: req.currentUser._id,
    };

    const saveVideo = await videoService.insertOneQuery(newVideoObj);

    res.status(200).send({
      message: "Video uploaded successfully!",
      data: { videoId: saveVideo._id },
    });
  } catch (error) {
    console.log("🚀 ~ postVideo ~ error:", error);
    res.status(400).send({ message: error.message || message });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      query,
      sortBy = "createdAt",
      sortType = 1,
    } = req.query;
    const { _id } = req.currentUser;

    const allVideos = await videoService.findAllQuery(
      { owner: _id },
      {
        limit,
        skip: (page - 1) * limit,
        sortBy: { [sortBy]: Number(sortType) },
      },
      {
        title: 1,
        description: 1,
        thumbnail: 1,
        videoFile: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
      }
    );

    res
      .status(200)
      .send({ message: "Videos fetched successfully!", data: allVideos });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) throw new Error("Please provide videoId!");

    const videoData = await videoService.findOneQuery(
      { _id: videoId },
      { updateedAt: 0 }
    );
    if (!videoData)
      throw new Error("No video Data available for provided videoId!");

    res
      .status(200)
      .send({ message: "Video fetch successfully!", data: videoData });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) throw new Error("VideoId is required to update the video!");

    const { title, description, thumbnail } = req.body;

    const videoData = await videoService.findOneQuery(
      { _id: videoId },
      { _id: 1 }
    );
    if (!videoData)
      throw new Error("No video available with associated videoId!");

    const updatedData = await videoService.updateOneQuery(
      { _id: videoId },
      { title, description, thumbnail }
    );

    res.status(200).send({ message: "Video updated successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) throw new Error("VideoId is required to delete the video!");

    const videoData = await videoService.findOneQuery(
      { _id: videoId },
      { _id: 1 }
    );

    if (!videoData)
      throw new Error("No video available with associated videoId!");
    await videoService.deleteOneQuery({ _id: videoId });

    res.status(200).send({ message: "Video deleted successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message || message });
  }
};

const togglePublishStatus = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId)
      throw new Error("VideoId is required to change the publish status!");

    const videoData = await videoService.findOneQuery(
      { _id: videoId },
      { _id: 1, isPublished: 1 }
    );
    if (!videoData)
      throw new Error("No video available with associated videoId!");

    const updateToggleStatus = await videoService.updateOneQuery(
      { _id: videoId },
      { isPublished: !videoData.isPublished }
    );

    res.status(200).send({
      message: "Video status changed successfully!",
      data: updateToggleStatus,
    });
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
