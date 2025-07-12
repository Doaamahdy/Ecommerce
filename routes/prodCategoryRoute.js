const express = require("express");
const router = express.Router();

const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
} = require("../controllers/prodCategoryController");
const { getProduct } = require("../controllers/productController");

router.post("/", authMiddleware, isAdminMiddleware, createCategory);
router.patch("/:id", authMiddleware, isAdminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteCategory);
router.get("/:id", authMiddleware, getCategory);
router.get("/", authMiddleware, getAllCategory);

module.exports = router;
