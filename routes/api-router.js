const { getEndpoints } = require("../controllers/news.controller");
const articleRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicRouter = require("./topics-router");
const userRouter = require("./user-router");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
