import jwt from "jsonwebtoken";
import { userModel } from "../models/index.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    console.log("🚀 ~ verifyJWT ~ token:", token);
    if (!token) throw new Error("Not a valid User!");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("🚀 ~ verifyJWT ~ decodedToken:", decodedToken);
    const userData = await userModel.findById(decodedToken._id);
    console.log("🚀 ~ verifyJWT ~ userData:", userData);

    req.currentUser = userData;
    next();
  } catch (error) {
    console.log("🚀 ~ verifyJWT ~ error:", error);
    res.status(400).send({ message: error.message });
  }
};

export default verifyJWT;
