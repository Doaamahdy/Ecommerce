const BCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BCategory.create(req.body);
    res.json({ newCategory });
  } catch (err) {
    throw new Error(err);
  }
});
const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await BCategory.findById(id);
    console.log("Hello");
    console.log(category);
    res.json({ category });
  } catch (err) {
    throw new Error(err);
  }
});
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await BCategory.find();
    res.json({ categories });
  } catch (err) {
    throw new Error(err);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const category = await BCategory.findByIdAndUpdate(id, req.body, {
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
    const category = await BCategory.findByIdAndDelete(id);
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
