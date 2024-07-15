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
  .post("/updateVideo/:videoId", authenticate, videoController.updateVideo)
  .delete("/deleteVideo/:videoId", authenticate, videoController.deleteVideo);

export default router;
