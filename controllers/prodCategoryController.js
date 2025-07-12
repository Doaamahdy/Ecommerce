const PCategory = require("../models/prodCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await PCategory.create(req.body);
    res.json({ newCategory });
  } catch (err) {
    throw new Error(err);
  }
});
const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await PCategory.findById(id);
    console.log("Hello");
    console.log(category);
    res.json({ category });
  } catch (err) {
    throw new Error(err);
  }
});
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await PCategory.find();
    res.json({ categories });
  } catch (err) {
    throw new Error(err);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await PCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ category });
  } catch (err) {
    throw new Error(err);
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await PCategory.findByIdAndDelete(id);
    res.json({ category });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
};
