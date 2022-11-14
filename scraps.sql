-- \c nc_news_test

-- -- ALTER TABLE articles 
-- -- ADD COLUMN comment_count INT;

-- SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes, 
-- (SELECT COUNT(*) FROM comments WHERE articles.article_id = comments.article_id) as "comment_count" 
-- FROM articles
-- ORDER BY created_at DESC;


-- -- SELECT * FROM comments WHERE article_id = 1;
-- SELECT COUNT(*) FROM comments WHERE article_id = 1;