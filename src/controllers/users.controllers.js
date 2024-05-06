import { userModel } from "../models/index.js";
import { userService } from "../services/index.js";
import { uploadOnCloudinary } from "../utils/index.js";

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

    const avatarURL = await uploadOnCloudinary(avtarImageLocalPath);
    const coverImageURL = await uploadOnCloudinary(coverImageLocalPath);

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

    if (!userName && !email) {
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

    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
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
      { $set: { refreshToken: undefined } },
      { new: true }
    );

    console.log("🚀 ~ logoutUser ~ userData:", userData);
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .send({ message: "User logggedOut successfully!" });
  } catch (error) {
    console.log("🚀 ~ logoutUser ~ error:", error);
    res.status(400).send({ message: "Logout successfully!" });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  // refreshAccessToken,
  // changeCurrentPassword,
  // getCurrentUser,
  // updateAccountDetails,
  // updateUserAvatar,
  // updateUserCoverImage,
  // getUserChannelProfile,
  // getWatchHistory
};
