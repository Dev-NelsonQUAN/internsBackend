const express = require("express");
const {
  registerUser,
  loginUser,
  getAllBlogsForAUser,
  createBlogForASpecificUser,
  deleteABlogUser,
  getABlogUser,
  deleteAllUser,
  handleWrongRoute,
  getAllAppsUser,
  deleteAUserBlog,
  updateAUserBlog,
} = require("../controller/userBlogController");

const router = express.Router();

router.post("/register", registerUser);
router.get('/get-all', getAllAppsUser)
router.post("/login", loginUser);
router.get("/:userId/blogs", getAllBlogsForAUser);
router.post("/:userId/blogs", createBlogForASpecificUser);
router.patch("/:userId/blogs/:blogId", updateAUserBlog);
router.delete("/:userId/blogs/:blogId", deleteAUserBlog);
router.delete("/:id", deleteABlogUser);
router.get("/:id", getABlogUser);
router.all("/delete-all", deleteAllUser);
router.all("*", handleWrongRoute);

module.exports = () => router;
