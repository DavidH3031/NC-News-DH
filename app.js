const express = require("express");
const { handleServerErrors } = require("./controllers/errors.controller");
const { getTopics, getArticles } = require("./controllers/news.controller");
const app = express();

// Endpoints

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

// Error Handling

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use(handleServerErrors);

module.exports = app;
