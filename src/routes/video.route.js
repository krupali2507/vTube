import { Router } from "express";
import { upload, authenticate } from "../middlewares/index.js";
import { videoController } from "../controllers/index.js";

const router = Router()
  .post(
    "/postAVideo",
    authenticate,
    upload.fields([{ name: "video" }]),
    videoController.postVideo
  )
  .get("/:videoId", authenticate, videoController.getVideoById)
  .get("/getAllVideos", authenticate, videoController.getAllVideos)
  .post(
    "/toggleVideoStatus/:videoId",
    authenticate,
    videoController.togglePublishStatus
  )
  .post("/updateVideo/:videoId", authenticate, videoController.updateVideo)
  .delete("/deleteVideo/:videoId", authenticate, videoController.deleteVideo);

export default router;
