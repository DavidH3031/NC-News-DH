const app = require("../app");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  it("GET - 200: Should return an array of 'topic objects'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles", () => {
  it("GET - 200: Should return an array of 'article objects' with the correct properties.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  it("GET - 200: Should return an article object with the correct properties.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  it("POST - 201: Should return the posted comment", () => {
    const comment = { username: "lurker", body: "Fake news!!!" };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toMatchObject({
          comment_id: expect.any(Number),
          author: "lurker",
          body: "Fake news!!!",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
});

describe("Error Handling", () => {
  it("GET - 404: Should return msg: Invalid URL when given an unknown endpoint", () => {
    return request(app)
      .get("/api/topicsssss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid URL");
      });
  });
  it("GET - 400: Should return 400 with error msg of 'Bad Request - Invalid datatype for ID'", () => {
    return request(app)
      .get("/api/articles/invalidDT")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - datatype for ID");
      });
  });
  it("GET - 404: Should return 404 with error msg of 'Invalid ID: ID not found!'", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID: ID not found!");
      });
  });
});
