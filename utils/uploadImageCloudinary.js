import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const uploadImageCloudinary = async (image) => {
  try {
    const buffer = image.buffer || Buffer.from(await image.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "satyamStore" }, // <== folder ka naam
        (error, result) => {
          if (error) return reject(error); // error handling added
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

export default uploadImageCloudinary;
