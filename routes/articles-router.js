const {
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticleVotes,
  postArticle,
} = require("../controllers/news.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/:article_id/comments", getArticleComments);
articleRouter.post("/:article_id/comments", postComment);
articleRouter.patch("/:article_id", patchArticleVotes);

module.exports = articleRouter;
/*
Request body accepts:

- an object with the following properties:

  - `author` which is the `username` from the users table
  - `title`
  - `body`
  - `topic`

Responds with:

- the newly added article, with all the above properties as well as:
  - `article_id`
  - `votes`
  - `created_at`
  - `comment_count`
*/
