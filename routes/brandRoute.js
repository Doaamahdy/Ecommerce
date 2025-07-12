const express = require("express");
const router = express.Router();

const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");
const {
    addBrand,
    getBrand,
    getAllBrands,
    updateBrand,
    deleteBrand
} = require("../controllers/brandController");
const { getProduct } = require("../controllers/productController");

router.post("/", authMiddleware, isAdminMiddleware, addBrand);
router.patch("/:id", authMiddleware, isAdminMiddleware, updateBrand);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteBrand);
router.get("/:id", authMiddleware, getBrand);
router.get("/", authMiddleware, getAllBrands);

module.exports = router;
