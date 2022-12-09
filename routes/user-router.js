const {
  getUsers,
  getUserByName,
  postUser,
} = require("../controllers/news.controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers).post(postUser);
userRouter.get("/:username", getUserByName);

module.exports = userRouter;
