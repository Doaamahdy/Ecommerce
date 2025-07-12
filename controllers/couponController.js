const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json({ newCoupon });
  } catch (err) {
    throw new Error(err);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ coupon });
  } catch (err) {
    throw new Error(err);
  }
});
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    res.json({ coupon });
  } catch (err) {
    throw new Error(err);
  }
});
const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findById(id);
    res.json({ coupon });
  } catch (err) {
    throw new Error(err);
  }
});
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ coupons });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  getAllCoupons,
};
