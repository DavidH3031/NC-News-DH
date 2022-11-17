const {
  deleteComment,
  patchCommentVotes,
} = require("../controllers/news.controller");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchCommentVotes);

module.exports = commentsRouter;
