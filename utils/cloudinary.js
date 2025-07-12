const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const cloudinaryUploadImg = async (fileToUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileToUpload,
      { resource_type: "auto" }, // Correct placement of resource_type
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve({ url: result.secure_url });
      }
    );
  });
};

module.exports = cloudinaryUploadImg;
