import { Router } from "express";
import express from "express";
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
  .post("/logout", authenticate, userController.logoutUser);

export default router;
