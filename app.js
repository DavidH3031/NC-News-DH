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
  patchArticleVotes,
  postComment,
  getUsers,
  deleteComment,
  getEndpoints,
} = require("./controllers/news.controller");
const app = express();
app.use(express.json());

// Endpoints
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
});

// Error Handling

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
