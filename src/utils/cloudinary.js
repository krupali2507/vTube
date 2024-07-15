import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localImgUrl) => {
  try {
    if (!localImgUrl) throw new Error("Could not find the image Local path!");

    const uploadFileData = await cloudinary.uploader.upload(localImgUrl, {
      resource_type: "auto",
    });

    fs.unlinkSync(localImgUrl);
    return { URL: uploadFileData.url, Duration: uploadFileData.duration };
  } catch (error) {
    fs.unlinkSync(localImgUrl);
    throw new Error("Upload to cloudinary operation gets failed!");
  }
};

export default uploadOnCloudinary;
