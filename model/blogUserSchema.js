const { Schema, model } = require("mongoose");

const blogUserSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  blogs: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: String, default: Date.now },
    },
  ],
});

module.exports = userBlogModel = model("blogUsers", blogUserSchema);
