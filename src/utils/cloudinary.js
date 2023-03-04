import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryUploadImg = async (fileToUpload) => {
  console.log("cloudinaryUpload : ", fileToUpload);
  console.log("dotenv : ", dotenv.config());

  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });

    console.log("data : ", data);
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};

export default cloudinaryUploadImg;
