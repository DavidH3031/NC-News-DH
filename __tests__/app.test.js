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
  it("PATCH - 200: Should return an article object with updated values.", () => {
    const plusBody = { inc_votes: 20 };
    return request(app)
      .patch("/api/articles/3")
      .send(plusBody)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 20,
        });
      });
  });
  it("PATCH - 200: Should return an article object with updated values when given a negative number.", () => {
    const negativeBody = { inc_votes: -30 };
    return request(app)
      .patch("/api/articles/3")
      .send(negativeBody)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: -30,
        });
      });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("GET - 200: Should return an array of comments for given article which should have the correct properties", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(11);
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    it("GET - 200: Should return an empty array when given article has no comments.", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBe(0);
        });
    });
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
  it("GET - 404: Should return 404 with error msg of 'Invalid ID: Article not found!'", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID: Article not found!");
      });
  });
  it("GET - 404: Should return 404 with error msg of 'No comments found for article with the id: 99999'", () => {
    return request(app)
      .get("/api/articles/77777/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID: Article not found!");
      });
  });
  it("GET - 400: Should return 404 with error msg of 'Bad Request - datatype for ID'", () => {
    return request(app)
      .get("/api/articles/tellmenews/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - datatype for ID");
      });
  });
<<<<<<< HEAD
  it("PATCH - 400: Valid ID but not found.", () => {
    const body = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/99999")
      .send(body)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID: Article not found!");
      });
  });
  it("PATCH - 400: Invalid ID datatype passed into URL", () => {
    const body = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/HELLO")
      .send(body)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - datatype for ID");
      });
  });
  // it("PATCH - 400: 'inc_votes' not found on body", () => {
  //   const body = { in_voe: 1 };
  //   return request(app)
  //     .patch("/api/articles/1")
  //     .send(body)
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Bad Request - datatype for ID");
  //     });
  // });
=======
  it("POST - 400: Body missing.", () => {
    const comment = { username: "lurker" };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Key "body" is missing');
      });
  });
  it("POST - 400: Username missing.", () => {
    const comment = { body: "Lurker" };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Key "username" is missing');
      });
  });
  it("POST - 400: Body key spelt incorrectly", () => {
    const comment = { username: "lurker", boy: "This article is amazing" };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Key "body" is missing');
      });
  });
  it("POST - 400: Username key spelt incorrectly", () => {
    const comment = { usename: "lurker", body: "Broken username" };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Key "username" is missing');
      });
  });
  it("POST - 400: Body fails schema validation. Username does not exist.", () => {
    const comment = { username: "Kev", body: "475582" };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Username does not exist!");
      });
  });
>>>>>>> 4426bb97303a96bcaea258c275dc0302517a2073
});
