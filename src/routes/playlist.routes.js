import { Router } from "express";
import { authenticate } from "../middlewares/index.js";
import { playlistController } from "../controllers/index.js";
const router = Router()
  .get("/:playlistId", authenticate, playlistController.getPlaylistById)
  .post("/createPlaylist", authenticate, playlistController.createPlaylist)
  .post(
    "/addtoPlaylist/:playlistId/:videoId",
    authenticate,
    playlistController.addVideoToPlaylist
  )
  .delete(
    "/deletefromPlaylist/:playlistId/:videoId",
    authenticate,
    playlistController.removeVideoFromPlaylist
  )
  .patch(
    "/updatePlaylist/:playlistId",
    authenticate,
    playlistController.updatePlaylist
  )
  .delete(
    "/deletePlaylist/:playlistId",
    authenticate,
    playlistController.deletePlaylist
  );
export default router;
