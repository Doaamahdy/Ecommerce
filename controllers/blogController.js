const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const { validate } = require("../models/productModel");
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({ newBlog, status: "success" });
  } catch (err) {
    throw new Error(err);
  }
});
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findById(id).populate("likes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: {
          numViews: 1,
        },
      },
      {
        new: true,
      }
    );
    res.json({ blog });
  } catch (err) {
    throw new Error(err);
  }
});
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({ blogs });
  } catch (err) {
    throw new Error(err);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ blog, status: "success" });
  } catch (err) {
    throw new Error(err);
  }
});
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);
    res.json({ blog });
  } catch (err) {
    throw new Error(err);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  try {
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loggedinUserId = req.user._id;
    // find if the user has liked the post
    const isLiked = blog?.isLiked;
    //  find the user if he disliked the course
    const isdisLiked = blog?.isdisLiked;

    const alreadyliked = blog.likes.find(
      (userId) => userId.toString() === loggedinUserId.toString()
    );
    const alreadyDisliked = blog.dislikes.find(
      (userId) => userId.toString() === loggedinUserId.toString()
    );
    if (alreadyDisliked) {
      await Blog.findByIdAndUpdate(blogId, {
        $pull: {
          dislikes: loggedinUserId,
        },
      });
    }
    if (alreadyliked) {
      await Blog.findByIdAndUpdate(blogId, {
        $pull: {
          likes: loggedinUserId,
        },
      });
    } else {
      await Blog.findByIdAndUpdate(blogId, {
        $push: {
          likes: loggedinUserId,
        },
      });
    }
    res.json({ blog });
  } catch (err) {
    throw new Error(err);
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  try {
    const loggedinUserId = req.user._id;
    let blog = await Blog.findById(blogId);
    const alreadyLiked = blog.likes.includes(loggedinUserId);
    const alreadyDisliked = blog.dislikes.includes(loggedinUserId);
    console.log(alreadyLiked, " ", alreadyDisliked);

    if (alreadyLiked) {
      blog = await Blog.findByIdAndUpdate(blogId, {
        $pull: {
          likes: loggedinUserId,
        },
      });
    }
    if (alreadyDisliked) {
      blog = await Blog.findByIdAndUpdate(blogId, {
        $pull: {
          dislikes: loggedinUserId,
        },
      });
    } else {
      blog = await Blog.findByIdAndUpdate(blogId, {
        $push: {
          dislikes: loggedinUserId,
        },
      });
    }
    res.json({ blog });
  } catch (err) {
    throw new Error(err);
  }
});
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
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => file),
      },
      {
        new: true,
      }
    );
    res.json({ findBlog });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAllBlogs,
  likeBlog,
  dislikeBlog,
  uploadImages,
};
