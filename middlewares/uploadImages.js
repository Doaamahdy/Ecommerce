const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2000000,
  },
});

const productImageResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const outputPath = `public/images/products/${file.filename}`;
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      fs.unlinkSync(outputPath);
    })
  );
  next();
};

const blogImageResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const outputPath = `public/images/blogs/${file.filename}`;
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      fs.unlinkSync(outputPath);
    })
  );
  next();
};

module.exports = {
  uploadPhoto,
  blogImageResize,
  productImageResize,
};
