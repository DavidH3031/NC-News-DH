const {
  getTopics,
  getUsers,
  getEndpoints,
} = require("../controllers/news.controller");
const articleRouter = require("./articles-router");
const commentsRouter = require("./comments-router");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);
apiRouter.get("/topics", getTopics);
apiRouter.get("/users", getUsers);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
