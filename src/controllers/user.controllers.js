import jwt from "jsonwebtoken";
import { userModel } from "../models/index.js";
import { userService } from "../services/index.js";
import { uploadOnCloudinary } from "../utils/index.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const generateAccessandRefreshToken = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.genertaeRefreshToken();

    user.refreshToken = refreshToken;
    console.log("🚀 ~ generateAccessandRefreshToken ~ user:", user);
    user.save();
    // user.save(); If anytime .save() only gives error of validation then we an use user.save({validateBeforeSave: false})

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating Access and refresh token!"
    );
  }
};

const registerUser = async (req, res) => {
  try {
    console.log("req.body:::", req.body);
    console.log("req.files::", req.files);
    let { fullName, userName, email, password } = req.body;

    if (
      [fullName, userName, email, password].some(
        (field) => field?.trim() === ""
      )
    )
      throw new Error("All are required fields!");

    const existedUser = await userService.findOneQuery({
      $or: [{ userName }, { email }],
    });

    if (existedUser) {
      throw new Error("User with email or username already exists!");
    }

    let avtarImageLocalPath = req.files?.avatar?.[0]?.path;
    let coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    const { URL: avatarURL } = await uploadOnCloudinary(avtarImageLocalPath);
    const { URL: coverImageURL } = await uploadOnCloudinary(
      coverImageLocalPath
    );

    let newUser = await userService.insertOneQuery({
      userName,
      email,
      fullName,
      avatar: avatarURL,
      coverImage: coverImageURL,
      password,
    });

    res.status(200).send({ message: "User Register Successfully!" });
  } catch (error) {
    console.log("🚀 ~ registerUser ~ error:", error);
    res.status(400).send({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("req.body::", req.body);
    const { email, userName, password } = req.body;
    console.log(email);

    if (!userName || !email) {
      throw new Error("username or email is required");
    }

    const user = await userService.findOneQuery({
      $or: [{ userName }, { email }],
    });

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new Error("Invalid Credentials!");
    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .send({ message: "User Login Successfully!" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { _id } = req.currentUser;
    console.log("🚀 ~ logoutUser ~ _id:", _id);

    const userData = await userModel.findByIdAndUpdate(
      _id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    console.log("🚀 ~ logoutUser ~ userData:", userData);

    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .send({ message: "User logggedOut successfully!" });
  } catch (error) {
    console.log("🚀 ~ logoutUser ~ error:", error);
    res.status(400).send({ message: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.headers.refreshToken;

    if (!incomingRefreshToken) throw new Error("Invalid Refresh Token!");

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log("🚀 ~ refreshAccessToken ~ decodedToken:", decodedToken);

    const userData = await userService.findByIdQuery({ _id: decodedToken._id });

    console.log("🚀 ~ refreshAccessToken ~ userData:", userData);
    if (!userData) throw new Error("Invalid Refresh Token!");
    if (incomingRefreshToken !== userData.refreshToken)
      throw new Error("Refresh Token is Invalid or expired!");

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      userData
    );
    console.log("🚀 ~ refreshAccessToken ~ refreshToken:", refreshToken);
    console.log("🚀 ~ refreshAccessToken ~ accessToken:", accessToken);

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .send({ message: "Access token refreshed!" });
  } catch (error) {
    console.log("🚀 ~ refreshAccessToken ~ error:", error);
    res.status(400).send({
      message:
        error?.message || "Something went wrong while refreshing Access token!",
    });
  }
};

const changeCurrentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userData = req.currentUser;
    console.log("🚀 ~ changeCurrentPassword ~ userData:", userData);

    const isCurrentPasswordMatch = await userData.isPasswordCorrect(
      currentPassword
    );
    console.log(
      "🚀 ~ changeCurrentPassword ~ isCurrentPasswordMatch:",
      isCurrentPasswordMatch
    );
    if (!isCurrentPasswordMatch) throw new Error("Current Password is wrong!");

    if (currentPassword === newPassword)
      throw new Error("New password can not be same as Old Password!");

    if (newPassword !== confirmNewPassword)
      throw new Error("Confirm new Password Do not match!");

    userData.password = newPassword;

    await userData.save();

    res.status(200).send({ message: "Password changed successfully!" });
  } catch (error) {
    res.status(400).send({
      message:
        error?.message || "Something went wrong while changing your password!",
    });
  }
};

const getCurrentUserInfo = async (req, res) => {
  try {
    const { password, createdAt, updatedAt, refreshToken, ...userData } =
      req.currentUser.toObject();
    console.log("userData:::", userData);

    res.status(200).send({
      message: "Current user info fetched successfully",
      data: userData,
    });
  } catch (error) {
    res.status(400).send({ message: error.message || error });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const avatarImageLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarImageLocalPath) throw new Error("Avatar file is missing!");
    if (!coverImageLocalPath) throw new Error("Cover Image is missing!");

    const avatarImageUrl = await uploadOnCloudinary(avatarImageLocalPath);
    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath);

    await userService.findByIdAndUpdateQuery(req.currentUser?._id, {
      avatar: avatarImageUrl,
      coverImage: coverImageUrl,
    });

    res.status(200).send({ message: "Image updated successfully!" });
  } catch (error) {
    console.log("🚀 ~ updateUserAvatar ~ error:", error);
    res.status(400).send({ message: error.message || error });
  }
};

const getUserChannelProfile = async (req, res) => {
  try {
    let { userName } = req.params;
    let userId = req.currentUser?._id;
    console.log("🚀 ~ getUserChannelProfile ~ userName", userName);
    if (!userName.trim())
      throw new Error("username required to fetch user details!");

    const userChannelData = await userService.findAggregateQuery(
      { userName },
      userId
    );
    // console.log(
    //   "🚀 ~ getUserChannelProfile ~ userChannelData:",
    //   userChannelData
    // );
    res.status(200).send({
      message: "User Profile Data fetched successfully!",
      data: userChannelData,
    });
  } catch (error) {
    console.log("🚀 ~ getUserChannelProfile ~ error:", error);
    res.status(400).send({ message: error.message || error });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUserInfo,
  // updateAccountDetails,
  updateUserAvatar,
  // updateUserCoverImage,
  getUserChannelProfile,
  // getWatchHistory
};
