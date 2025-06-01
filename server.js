const express = require("express");
require("dotenv/config");
const app = express();
const { PORT } = process.env;
const port = PORT;
app.use(express.json());

const dataDB = require("./config/db");
const router = require("./routes/userBlogRouter");
const cors = require("cors");
dataDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", router());

app.all("/", (req, res) => {
  return res.status(200).json({messsage: "API is up and running"})
})
app.all("*", (req, res) => {
  return res.status(200).json({messsage: "Route doesn't exist"})
})

app.listen(port, () => {
  console.log(
    new Date().toDateString(),
    `Listening to http://localhost:${port}`
  );
});
