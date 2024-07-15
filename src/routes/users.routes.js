import { Router } from "express";
import { upload, authenticate } from "../middlewares/index.js";
import { userController } from "../controllers/index.js";

const router = Router()
  .post(
    "/registerUser",
    upload.fields([
      {
        name: "avatar",
      },
      {
        name: "coverImage",
      },
    ]),
    userController.registerUser
  )
  .post("/loginUser", userController.loginUser)
  .post("/logout", authenticate, userController.logoutUser)
  .post("/refreshAccessToken", userController.refreshAccessToken)
  .post(
    "/changeCurrentPassword",
    authenticate,
    userController.changeCurrentPassword
  )
  .get("/getCurrentUserInfo", authenticate, userController.getCurrentUserInfo)
  .post(
    "/updateUserAvatar",
    authenticate,
    upload.fields([{ name: "avatar" }, { name: "coverImage" }]),
    userController.updateUserAvatar
  )
  .get(
    "/getUserChannelProfile/:userName",
    authenticate,
    userController.getUserChannelProfile
  );

export default router;
