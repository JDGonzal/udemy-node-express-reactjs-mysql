const express = require("express");

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, editor } = require("../middleware/roles.js");
const mysqlConnection = require('../utils/database.js');

// Setup the express server routeRoles
const routeRoles = express.Router();

routeRoles.post("/api/auth/signup/roleV", async (request, response) => {
  var query = `INSERT into mytestdb.User_Roles
              (createdAt, updatedAt, roleId, userId)
              VALUE (NOW(), NOW(), ?, ?)`;
  var values = ['1', request.body['userId']];
  mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      console.log(err);
    }
  });
});

routeRoles.post("/api/auth/signup/roleE", [auth, editor], async (request, response) => {
  var query = `INSERT into mytestdb.User_Roles
              (createdAt, updatedAt, roleId, userId)
              VALUE (NOW(), NOW(), ?, ?)`;
  var values = ['2', request.body['userId']];
  mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      console.log(err);
    }
  });
});

routeRoles.post("/api/auth/signup/roleA", [auth, admin], async (request, response) => {
  var query = `INSERT into mytestdb.User_Roles
              (createdAt, updatedAt, roleId, userId)
              VALUE (NOW(), NOW(), ?, ?)`;
  var values = ['3', request.body['userId']];
  mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      console.log(err);
    }
  });
});

// Export the routeRoles
module.exports = routeRoles;
