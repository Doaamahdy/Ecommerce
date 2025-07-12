const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const addBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json({ newBrand });
  } catch (err) {
    throw new Error(err);
  }
});
const getBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const brand = await Brand.findById(id);
    res.json({ brand });
  } catch (err) {
    throw new Error(err);
  }
});
const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({ brands });
  } catch (err) {
    throw new Error(err);
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ brand });
  } catch (err) {
    throw new Error(err);
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const brand = await Brand.findByIdAndDelete(id);
    res.json({ brand });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  addBrand,
  getBrand,
  getAllBrands,
  updateBrand,
  deleteBrand
};
