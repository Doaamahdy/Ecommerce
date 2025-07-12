const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controllers/blogController");

const { uploadPhoto, blogImageResize } = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdminMiddleware, createBlog);
router.put(
  "/upload-images/:id",
  authMiddleware,
  isAdminMiddleware,
  uploadPhoto.array("images", 2),
  blogImageResize,
  uploadImages
);
router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.patch("/:id", authMiddleware, isAdminMiddleware, updateBlog);
router.get("/:id", authMiddleware, getBlog);
router.get("/", authMiddleware, getAllBlogs);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteBlog);
module.exports = router;
