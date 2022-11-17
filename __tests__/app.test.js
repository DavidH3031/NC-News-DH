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

describe("/api", () => {
  it("GET - 200: Should return a JSON describing all the available endpoints.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(expect.any(Object));
      });
  });
  it("GET - 200: Should return a JSON with the correct keys.", () => {
    const endpointKeys = [
      "GET /api",
      "GET /api/topics",
      "GET /api/articles",
      "GET /api/articles/:article_id",
      "PATCH /api/articles/:article_id",
      "GET /api/articles/:article_id/comments",
      "POST /api/articles/:article_id/comments",
      "DELETE /api/comments/:comment_id",
      "GET /api/users",
    ];
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(Object.keys(endpoints)).toEqual(
          expect.arrayContaining(endpointKeys)
        );
      });
  });
  it("GET - 200: Each key should have a description", () => {
    const keys = [
      "GET /api",
      "GET /api/topics",
      "GET /api/articles",
      "GET /api/articles/:article_id",
      "PATCH /api/articles/:article_id",
      "GET /api/articles/:article_id/comments",
      "POST /api/articles/:article_id/comments",
      "DELETE /api/comments/:comment_id",
      "GET /api/users",
    ];
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints["GET /api/topics"].description).toBe(
          "serves an array of all topics"
        );
        keys.forEach((key) => {
          expect(endpoints[key]).toMatchObject({
            description: expect.any(String),
            exampleResponse: expect.any(Object),
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
  it("GET - 200: Should return only those with given topic.", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        expect(body.articles[0]).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: "cats",
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        });
      });
  });
  it("GET - 200: Should return an empty array.", () => {
    return request(app)
      .get("/api/articles?topic=games")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
        expect(Array.isArray(body.articles));
      });
  });
  it("GET - 200: Should return an array sorted by given argument.", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("article_id", { descending: true });
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
  it("GET - 200: Should return an array in ascending order.", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at");
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
  it("GET - 200: Should return an array in ascending order sorted by article ID with the topic of cats.", () => {
    return request(app)
      .get("/api/articles?order=asc&sort_by=article_id&topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("article_id");
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "cats",
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
        expect(body.article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: "11",
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

describe("/api/users", () => {
  it("GET - 200: Should return an array of objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  describe("/api/users/:username", () => {
    it("GET - 200: Should return a user object with the correct properties", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          });
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  it("DELETE - 204: Should celete the comment with given ID and respond with 204 and no content", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  it("PATCH - 200: Should return an object with updated votes", () => {
    const plusBody = { inc_votes: 20 };
    return request(app)
      .patch("/api/comments/1")
      .send(plusBody)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: 36,
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
  describe("Query Error Handling", () => {
    it("GET - 404: Should respond with invalid query when passed an invalid column name in sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=whatcolumn")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("sort_by: 'whatcolumn' is not found.");
        });
    });
    it("GET - 400: Should respond with 400 when given an incorrect topic", () => {
      return request(app)
        .get("/api/articles?topic=123456")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("topic '123456' is not allowed");
        });
    });
    it("GET - 400: Should respond with 400 when given an invalid order by value", () => {
      return request(app)
        .get("/api/articles?order=down")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "order 'down' does not exist. Please use: 'asc' or 'desc'"
          );
        });
    });
    it("GET - 404: Should respond with 400 when all but one query is valid", () => {
      return request(app)
        .get("/api/articles?order=asc&sort_by=whatcolumn&topic=mitch")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("sort_by: 'whatcolumn' is not found.");
        });
    });
  });
  describe("Delete Error Handling", () => {
    it("DELETE - 400: Should return 400 when given an invalid datatype for ID", () => {
      return request(app)
        .delete("/api/comments/HELLO")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request - Invalid datatype for ID");
        });
    });
    it("DELETE - 404: Should return 404 when given a valid ID but not found", () => {
      return request(app)
        .delete("/api/comments/30312899")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("comment with that ID does not exist");
        });
    });
  });
  it("GET - 400: Should return 400 with error msg of 'Bad Request - Invalid datatype for ID'", () => {
    return request(app)
      .get("/api/articles/invalidDT")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - Invalid datatype for ID");
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
  it("GET - 400: Should return 400 with error msg of 'Bad Request - Invalid datatype for ID'", () => {
    return request(app)
      .get("/api/articles/tellmenews/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - Invalid datatype for ID");
      });
  });
  it("PATCH - 404: Valid ID but not found.", () => {
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
        expect(body.msg).toBe("Bad Request - Invalid datatype for ID");
      });
  });
  it("PATCH - 400: 'inc_votes' not found on body", () => {
    const body = { in_voe: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Key "inc_votes" is missing');
      });
  });
  it("PATCH - 400: 'inc_votes' was given wrong datatype", () => {
    const body = { inc_votes: "Hello" };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - Invalid datatype for ID");
      });
  });
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
});

describe("Further Error Handling", () => {
  describe("/api/users/:username", () => {
    it("GET - 404: Should return a 404 and error message if user does not exist", () => {
      return request(app)
        .get("/api/users/Kev22")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("user with that username does not exist");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("PATCH - 404: Valid ID but not found.", () => {
      const body = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/99999")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID: comment not found!");
        });
    });
    it("PATCH - 400: Invalid ID datatype passed into URL", () => {
      const body = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/HELLO")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request - Invalid datatype for ID");
        });
    });
    it("PATCH - 400: 'inc_votes' not found on body", () => {
      const body = { in_voe: 1 };
      return request(app)
        .patch("/api/comments/1")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Key "inc_votes" is missing');
        });
    });
    it("PATCH - 400: 'inc_votes' was given wrong datatype", () => {
      const body = { inc_votes: "Hello" };
      return request(app)
        .patch("/api/comments/1")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request - Invalid datatype for ID");
        });
    });
  });
});
