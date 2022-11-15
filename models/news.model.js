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

exports.fetchArticleById = (id) => {
  return db
    .query(
      `
    SELECT author, title, article_id, body, topic, created_at, votes
    FROM articles
    WHERE article_id = $1;`,
      [id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid ID: ID not found!",
        });
      }
      return res.rows[0];
    });
};

exports.insertComment = (id, { username, body }) => {
  const date = new Date();
  return db
    .query(
      `
      INSERT INTO comments
      (body, author, article_id, votes, created_at)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [body, username, id, 0, date.toISOString()]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};
