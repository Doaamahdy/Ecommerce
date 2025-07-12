const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    throw new Error(err);
  }

  res.json({
    message: "Hey product post route",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (err) {
    throw new Error(err);
  }
});
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    let queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    // First Filter
    excludeFields.forEach((field) => delete queryObj[field]);
    // Handle Number values
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);
    let query = Product.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    // Limting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page doesn't exist");
    }
    fetchedProducts = await query;

    console.log(queryObj);
    // const products = await Product.find();
    res.json(fetchedProducts);
  } catch (err) {
    throw new Error(err);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const addToWhishList = asyncHandler(async (req, res) => {
  try {
    const { _id: id } = req.user;
    const { productId } = req.body;
    let user = await User.findById(id);

    const isAlreadyAdded = user.whishList.find(
      (id) => id.toString() === productId.toString()
    );
    if (isAlreadyAdded) {
      user = await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            whishList: productId,
          },
        },
        {
          new: true,
        }
      );
    } else {
      user = await User.findByIdAndUpdate(
        id,
        {
          $push: {
            whishList: productId,
          },
        },
        {
          new: true,
        }
      );
    }
    res.json({ user });
  } catch (err) {
    throw new Error(err);
  }
});

const rating = asyncHandler(async (req, res) => {
  try {
    const { _id: id } = req.user;
    const { star, comment, productId } = req.body;

    let product = await Product.findById(productId);
    let alreadyRated = product.ratings.find(
      (rate) => rate.postedby.toString() === id.toString()
    );
    if (alreadyRated) {
      await Product.findOneAndUpdate(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
          },
        },
        {
          new: true,
        }
      );
    } else {
      await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    product = await updateTotalRating(productId);
    res.json({ product });
  } catch (err) {
    throw new Error(err);
  }
});
const updateTotalRating = async function (id) {
  const product = await Product.findById(id);
  let numRatings = product.ratings.length;
  let sumRating = product.ratings
    .map((rate) => rate.star)
    .reduce((total, currrent) => (total += currrent), 0);
  let totalRating = Math.round(sumRating / numRatings);
  return await Product.findByIdAndUpdate(
    id,
    {
      totalrating: totalRating,
    },
    {
      new: true,
    }
  );
};

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      // fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => file),
      },
      {
        new: true,
      }
    );
    res.json({ findProduct });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWhishList,
  rating,
  uploadImages,
};
