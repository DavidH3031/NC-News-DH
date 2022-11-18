const { getTopics, postTopic } = require("../controllers/news.controller");

const topicRouter = require("express").Router();

topicRouter.route("/").get(getTopics).post(postTopic);
module.exports = topicRouter;
