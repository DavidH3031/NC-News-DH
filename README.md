# Northcoders News API

## Summary

This API will allow you to view news articles and the relevant information that comes with them. You can filter by topic, choose which order you want the information in and how you want to sort it.

I have implemented the basic features of what you would expect on a news site as listed below in the Hosted Version section.

You can **view**: Users, Topics, Articles, Comments.

You can **post**: Comments.

You can **alter**: Articles upvotes/downvotes.

You can **delete**: Comments.

# Hosted Version

<https://dh-ncnews.cyclic.app/>

Using the provided URL will allow you to interact with the API via the web. Listed below are the available endpoints and a very brief description.

- GET /api - Returns a list of endpoints in **JSON** format (must be parsed).
- GET /api/users - Returns a list of users currently registered.
- GET /api/users/:username - Returns a single user.
- GET /api/topics - Returns a list of topics.
- GET /api/articles - Returns a list of articles.
- GET /api/articles/:article_id - Returns a specific article.
- PATCH /api/articles/:article_id - Allows you to add/subtract votes.
- GET /api/articles/:article_id/comments - Returns a list of comments for article.
- POST /api/articles/:article_id/comments - Allows POSTing of a new comment.
- DELETE /api/comments/comment_id - Allows you to **delete** comments by ID.

# Set-up for self-hosting.

To begin using this API hosted on your own machine you must first, **Clone** this respository.

To clone you must first:

- Click the green Code button at the top of the repo.
- Copy the link that shows and looks something like this (https://github.com/DavidH3031/NC-News-DH.git).
- Open the terminal where ever you would like to store the files and type the following.

  ```sh
  git clone https://github.com/DavidH3031/NC-News-DH.git
  ```

- Once that has completed you must install the dependencies by typing.
  ```sh
  npm install
  ```
- Create the environment variables for accessing the DATABASE

  - First create 2 files one named `.env.test` and another named `.env.development`.
  - Second populate these files with `PGDATABASE=nc_news_test` for test and `PGDATABASE=nc_news` for development (Reference .env-example for structure).

    This will allow you to test the functionality of the API with a much smaller database saving you time.

- Next we must initialise the databse with these commands.

  ```sh
  npm run setup-dbs; npm run seed
  ```

  This will first create the Databases called `nc_news` and `nc_news_test`. Then populate those with data from the seed file.

- I have provided a full test suite to confirm the functionality of this API and if you chose to edit the code this will be helpful to make sure everything is still working. You can test using the following.

  ```sh
  npm test __tests__/app.test.js
  ```

- Finally to host locally you can run the script 'start' like this.
  ```sh
  npm start
  ```

# Requirements

- NodeJS - v14.21.1 or Higher.
- PostgreSQL - 11.18 or Higher.
