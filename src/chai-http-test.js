const { faker } = require("@faker-js/faker");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { response, json } = require("express");
const expect = chai.expect;
// const app = require("../src/app"); // Import your Express app
const app = "http://127.0.0.1:3000";

chai.use(chaiHttp);

describe("User API Tests", function () {
  describe("POST /register", function () {
    it("should register a new user and return HTTP 201", function (done) {
      chai
        .request(app)
        .post("/users/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          email: faker.internet.email(),
          phoneNumber: "1234567890",
          password: "password123",
        })
        .end(function (err, res) {
          expect(res.status).to.equal(201);
          // expect(res.text).to.equal("User registered successfully");
          done();
        });
    });

    it("should return HTTP 500 for duplicate registration", function (done) {
      chai
        .request(app)
        .post("/users/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          email: "john.doe@example.com",
          phoneNumber: "1234567890",
          password: "password123",
        })
        .end(function (err, res) {
          expect(res.status).to.equal(500);
          done();
        });
    });
  });

  describe("POST /login", function () {
    it("should log in a user and return a token", function (done) {
      chai
        .request(app)
        .post("/users/login")
        .send({
          email: "john.doe@example.com",
          password: "password123",
        })
        .end(function (err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("token");
          expect(res.body).to.have.property("user");
          done();
        });
    });

    it("should return HTTP 400 for incorrect login credentials", function (done) {
      chai
        .request(app)
        .post("/users/login")
        .send({
          email: "john.doe@example.com",
          password: "wrongpassword",
        })
        .end(function (err, res) {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe("POST /logout", function () {
    it("should log out a user and return HTTP 200", function (done) {
      // Perform a login first to get the token
      chai
        .request(app)
        .post("/users/login")
        .send({
          email: "john.doe@example.com",
          password: "password123",
        })
        .end(function (err, responseBody) {
          const token = responseBody.body.token;
          console.log(token);

          // Use the obtained token for the logout request
          chai
            .request(app)
            .post("/users/logout")
            .set("auth-token", token)
            .end(function (err, logoutRes) {
              expect(logoutRes.status).to.equal(200);
              expect(logoutRes.text).to.equal("Logout successful");
              done();
            });
        });
    });

    it("should return HTTP 401 for logout without a valid token", function (done) {
      chai
        .request(app)
        .post("/users/logout")
        .end(function (err, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});
