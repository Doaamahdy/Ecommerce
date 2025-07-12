const Color = require("../models/Color");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const addColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json({ newColor });
  } catch (err) {
    throw new Error(err);
  }
});
const getColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const color = await Color.findById(id);
    res.json({ color });
  } catch (err) {
    throw new Error(err);
  }
});
const getAllColors = asyncHandler(async (req, res) => {
  try {
    const colors = await Color.find();
    res.json({ colors });
  } catch (err) {
    throw new Error(err);
  }
});
const updateColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const color = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ color });
  } catch (err) {
    throw new Error(err);
  }
});
const deleteColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const color = await Color.findByIdAndDelete(id);
    res.json({ color });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  addColor,
  getColor,
  getAllColors,
  updateColor,
  deleteColor,
};
