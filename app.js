const express = require("express");
const {
  handleServerErrors,
  handlePSQLErrors,
  handleCustomErrors,
} = require("./controllers/errors.controller");
const {
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
} = require("./controllers/news.controller");
const app = express();

// Endpoints

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

// Error Handling

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
