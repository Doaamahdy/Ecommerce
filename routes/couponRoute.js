const express = require("express");
const router = express.Router();

const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");

const {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  getAllCoupons,
} = require("../controllers/couponController");

router.get("/", authMiddleware, getAllCoupons);
router.post("/", authMiddleware, isAdminMiddleware, createCoupon);
router.patch("/:id", authMiddleware, isAdminMiddleware, updateCoupon);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteCoupon);
router.get("/:id", authMiddleware, deleteCoupon);

module.exports = router;
