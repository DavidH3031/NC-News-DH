const { getUsers, getUserByName } = require("../controllers/news.controller");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByName);

module.exports = userRouter;
