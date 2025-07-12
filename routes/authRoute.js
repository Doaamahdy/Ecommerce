const express = require("express");
const router = express.Router();

const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");

const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWhishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderSatuts,
} = require("../controllers/userController");

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.get("/logout", logout);
router.get("/refresh", handleRefreshToken);

router.post("/cart", authMiddleware, userCart);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);

router.post("/apply-coupon", authMiddleware, applyCoupon);
router.get("/orders", authMiddleware, getOrders);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdminMiddleware,
  updateOrderSatuts
);

router.get("/getUsers", authMiddleware, isAdminMiddleware, getAllUsers);
router.get("/whishlist", authMiddleware, getWhishlist);
router.get("/:id", authMiddleware, isAdminMiddleware, getSingleUser);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteUser);
router.patch("/edit-user", authMiddleware, updateUser);
router.patch("/save-address", authMiddleware, saveAddress);
router.patch("/block-user/:id", authMiddleware, isAdminMiddleware, blockUser);
router.patch(
  "/unblock-user/:id",
  authMiddleware,
  isAdminMiddleware,
  unblockUser
);

module.exports = router;
