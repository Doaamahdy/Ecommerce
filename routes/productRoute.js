const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWhishList,
  rating,
  uploadImages,
} = require("../controllers/productController");

const {
  isAdminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");

const {
  uploadPhoto,
  productImageResize,
} = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdminMiddleware, createProduct);
router.put(
  "/upload-images/:id",
  authMiddleware,
  isAdminMiddleware,
  uploadPhoto.array("images", 10),
  productImageResize,
  uploadImages
);
router.get("/", getAllProducts);
router.put("/whishlist", authMiddleware, addToWhishList);
router.put("/rating", authMiddleware, rating);

router.get("/:id", getProduct);
router.patch("/:id", authMiddleware, isAdminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteProduct);

module.exports = router;
