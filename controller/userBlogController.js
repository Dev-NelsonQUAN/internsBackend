const argon2 = require("argon2");
const userBlogModel = require("../model/blogUserSchema");

// handle Errors
const handleError = async (res, err) => {
  return res
    .status(500)
    .json({ message: "An error occurred", error: err || err.message });
};

const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName && !email && !password) {
      return res.status(401).json({ message: "All fields required" });
    }
    if (!userName) {
      return res.status(409).json({ message: "Username is required" });
    }
    if (!email) {
      return res.status(409).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(409).json({ message: "Password is required" });
    }

    const findIfEmailExist = await userBlogModel.findOne({ email });
    if (findIfEmailExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await argon2.hash(password);

    const createUser = await userBlogModel.create({
      userName,
      email,
      password: hashPassword,
      blogs: [],
    });

    return res
      .status(201)
      .json({ message: "User created successfully", data: createUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
    // handleError(res, err.message, err);
  }
};

//Get All user
const getAllAppsUser = async (req, res) => {
  try {
    const getAllUser = await userBlogModel.find();

    return res
      .status(200)
      .json({ message: "All users gotten successfully", data: getAllUser });
  } catch (err) {
    handleError(res, err.message);
  }
};

//Login an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userBlogModel.findOne({ email });

    if (!findUser) {
      return res.status(409).json({
        message: "Invalid Email or password",
      });
    }

    const checkPassword = await argon2.verify(findUser.password, password);

    if (!checkPassword) {
      return res.status(409).json({ message: "Invalid Email or Password" });
    }

    return res.status(200).json({
      message: "User login successfully",
      name: findUser.userName,
      email: findUser.email,
      //   password: findUser.password,
    });
  } catch (err) {
    handleError(res, err.message);
  }
};

//Get All Blogs for a user
const getAllBlogsForAUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const getUserTask = await userBlogModel.findById(userId);
    if (!getUserTask) {
      return res.status(404).json({ message: "No user found" });
    }
    return res
      .status(200)
      .json({ message: "Gotten tasks", data: getUserTask.blogs });
  } catch (err) {
    handleError(res, err.message);
  }
};

//Create a new blog for user
const createBlogForASpecificUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, content, createdAt } = req.body;
    const findUserToCreateTask = await userBlogModel.findById(userId);

    if (!findUserToCreateTask) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = await findUserToCreateTask.blogs.push({
      title,
      content,
      createdAt,
    });

    if (!title && !content) {
      return res
        .status(409)
        .json({ message: "Title and Content are required" });
    }

    await findUserToCreateTask.save();

    return res.status(200).json({
      message: "Task successfully created",
      datas: findUserToCreateTask,
      tasks: task,
    });
  } catch (err) {
    handleError(res, err);
  }
};

//Update A Task
const updateAUserBlog = async (req, res) => {
  try {
    const { userId, blogId } = req.params;
    const { title, content, createdAt } = req.body;
    const checkIfUserExists = await userBlogModel.findById(userId);

    if (!checkIfUserExists) {
      return res.status(404).json({ message: "No user found" });
    }

    const updateTaskById = await checkIfUserExists.blogs.id(blogId);
    if (!updateTaskById) {
      return res.status(409).json({ message: "No task found for update" });
    }

    if (title) updateTaskById.title = title;
    if (content) updateTaskById.content = content;
    if (createdAt) updateTaskById.createdAt = createdAt;

    await checkIfUserExists.save();

    return res.status(200).json({
      message: "Tasks updated successfully",
      data: checkIfUserExists,
      update: checkIfUserExists.title,
      update2: checkIfUserExists.content,
    });
  } catch (err) {
    // handleError(res, err.message);
    return res.status(500).json({message: "An error occurred", error: err.message})
  }
};

// Delete A Task
const deleteAUserBlog = async (req, res) => {
  try {
    const { userId, blogId } = req.params;
    const findTheUser = await userBlogModel.findById(userId);

    if (!findTheUser) {
      return res.status(404).json({ message: "User Not found for deletion" });
    }

    const getTheIdToDelete = findTheUser.blogs.id(blogId);

    if (!getTheIdToDelete) {
      return res.status(404).json({ message: "No blog to delete" });
    }

    getTheIdToDelete.deleteOne();
    await findTheUser.save();

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    handleError(res, err.message);
  }
};

//Delete A user
const deleteABlogUser = async (req, res) => {
  try {
    const { id } = req.params;
    const findUserAndDelete = await userBlogModel.findByIdAndDelete(id);

    if (!findUserAndDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    handleError(res, err.message);
  }
};

// Get a blog's user
const getABlogUser = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await userBlogModel.findById(id);

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Gotten user successfully", data: findUser });
  } catch (err) {
    handleError(res, err.message);
  }
};

//Delete All Blog's User
const deleteAllUser = async (req, res) => {
  try {
    const deleteAll = await userBlogModel.deleteMany();

    return res.status(200).json({ message: "All user successfully deleted" });
  } catch (err) {
    handleError(res, err);
  }
};

//When user hits a wrong route
const handleWrongRoute = async (req, res) => {
  return res
    .status(404)
    .json({ message: "Route not found, hope you aren't lost?" });
};

module.exports = {
  registerUser,
  getAllAppsUser,
  loginUser,
  getAllBlogsForAUser,
  createBlogForASpecificUser,
  updateAUserBlog,
  deleteAUserBlog,
  deleteABlogUser,
  getABlogUser,
  deleteAllUser,
  handleWrongRoute,
};
