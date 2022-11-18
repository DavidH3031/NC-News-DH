const {
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticleVotes,
  postArticle,
  deleteArticle,
} = require("../controllers/news.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);
articleRouter.route("/:article_id").get(getArticleById).delete(deleteArticle);
articleRouter.get("/:article_id/comments", getArticleComments);
articleRouter.post("/:article_id/comments", postComment);
articleRouter.patch("/:article_id", patchArticleVotes);

module.exports = articleRouter;
