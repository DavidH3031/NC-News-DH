const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((res) => {
    return res.rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query(
      `
    SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes, 
    (SELECT COUNT(*) FROM comments WHERE articles.article_id = comments.article_id) as "comment_count" 
    FROM articles
    ORDER BY created_at DESC;
    `
    )
    .then((res) => {
      return res.rows;
    });
};
