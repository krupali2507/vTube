import { Router } from "express";
import { upload, authenticate } from "../middlewares/index.js";
import { videoController } from "../controllers/index.js";

const router = Router().post(
  "/postAVideo",
  authenticate,
  upload.fields([{ name: "video" }]),
  videoController.postVideo
);

export default router;
