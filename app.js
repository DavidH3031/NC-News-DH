const express = require("express");
const {
  handleServerErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./controllers/news.controller");
const app = express();

// Endpoints

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

// Error Handling

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
