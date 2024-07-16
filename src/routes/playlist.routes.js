import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import { playlistController } from "../controllers/index.js";
const router = Router()
  .post("/createPlaylist", authenticate, playlistController.createPlaylist)
  .post(
    "/addtoPlaylist/:playlistId/:videoId",
    authenticate,
    playlistController.addVideoToPlaylist
  );

export default router;
