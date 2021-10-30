// Import dependencies
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const Validator = require('fastest-validator');
require("dotenv").config(); // import config = require('config');
const fetch = require('cross-fetch');

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, editor, viewer } = require("../middleware/roles.js");
const mysqlConnection = require('../database.js');

// Setup the express server routeAuth
const routeAuth = express.Router();

dummyEmail = 'im.user@no.matter.com';

// On post
routeAuth.post("/api/auth/signin", async (request, response) => {
  var query = `SELECT u.*, (SELECT GROUP_CONCAT(ur.roleId SEPARATOR ', ')
                            FROM user_roles ur 
                          WHERE ur.userId = u.userId) AS userRole
               from mytestdb.Users u
               where email=? or password=?`;
  // Dummy data : email: im.user@no.matter.com , password: P@$$w0rd
  const users = [{ email: dummyEmail, password: "$2b$08$4q5DeFfvBLhxH92MJD3Qce52qCuO2taeFTvmyd8BStUZmZvYrZxzq", roles: ["admin", "editor", "viewer"] }];
  console.log('/api/auth/signin');
  // Get to user from the database, if the user is not there return error
  var jsonValues = {
    email: request.body['email'].toString().toLowerCase(),
    password: request.body['password']
  };
  const schema = {
    email: { type: "string", optional: false, max: "100", min: "5" },
    password: { type: "string", optional: false, max: "100", min: "6" }
  }
  const v = new Validator();
  const validationResponse = v.validate(jsonValues, schema);
  if (validationResponse !== true) {
    return response.status(400).json({
      message: "Validation Failed",
      errors: validationResponse
    });
  }
  var arrayValues = Object.values(jsonValues);
  mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: "Something went wrong",
        ok: false,
        error: err
      });
    }
    console.log('row ', rows[0].password);

    if (!rows) {
      return response.status(400).json({
        message: "Invalid email or password",
        errors: validationResponse
      });
    }
    // Compare the password with the password in the database
    const valid = bcrypt.compare(jsonValues.password, rows[0].password);
    if (!valid) {
      return response.status(400).json({
        message: "Invalid password or email",
        errors: validationResponse
      });
    } else {
      let rolesArray =[];
      let user = users.find(u => u.email === dummyEmail);
;
      rows[0].userRole.includes('1')?rolesArray.push('viewer'):null;
      rows[0].userRole.includes('2')?rolesArray.push('editor'):null;
      rows[0].userRole.includes('3')?rolesArray.push('admin'):null;
      console.log('role:',rolesArray);
      const token = jwt.sign({
        id: rows[0].userId,
        roles: rolesArray,
      }, process.env.AUTH_SEED, { expiresIn: "60m" });//Expires in 60 minutes

      response.send({
        ok: true,
        token: token
      });
      var date = new Date();
      console.log(date.toLocaleString());
      console.log(new Date(date.getTime() + 60 * 60000).toLocaleString());
      console.log(token);
    }
  });
});

routeAuth.get("/api/auth/signup/:email", (request, response) => {
  var query = `SELECT COUNT(userId)as found from mytestdb.Users
               where email=?`;
  var values = [
    request.params.email.toString().toLowerCase()
  ];

  mysqlConnection.query(query, values, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: "Something went wrong",
        ok: false,
        error: err
      });
    }
    if (rows[0].found > 0) {
      query = `SELECT UserId as found from mytestdb.Users
               where email=?`;
      mysqlConnection.query(query, values, function (err, rows, fields) {
        if (err) {
          response.status(501).json({
            message: "Something went wrong",
            ok: false,
            error: err
          });
        }
        response.send({
          ok: true,
          found: rows[0].found
        });
      });
    } else {
    console.log('found: ', rows[0].found);
    response.send({
      ok: true,
      found: rows[0].found
    });
  }
  });
  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/auth/signup/im.user@no.matter.com"
  // in "Body" use none
  // Run again the GET option to check the list of records
});

routeAuth.post("/api/auth/signup/roleV", async (request, response) => {
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

routeAuth.post("/api/auth/signup/roleE", [auth, editor], async (request, response) => {
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

routeAuth.post("/api/auth/signup/roleA", [auth, admin], async (request, response) => {
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

const storeRoles = (req, res) => {

}

const passwordEncrypt = require('../generatePassword.js');
routeAuth.post("/api/auth/signup", async (request, response) => {
  var query = `INSERT into mytestdb.Users
              (email,password,firstName,lastName,createdAt,updatedAt)
              VALUE (?,?,?,?,NOW(),NOW())`;
  var jsonValues = {
    email: request.body['email'].toString().toLowerCase(),
    password: await passwordEncrypt(request.body['password']),
    firstName: request.body['firstName'],
    lastName: request.body['lastName'],
    RolesArray: request.body['Roles'],
    Token: request.body['Token'],
  };

  const schema = {
    email: { type: "string", optional: false, max: "100", min: "5" },
    password: { type: "string", optional: false, max: "255", min: "60" },
    firstName: { type: "string", optional: false, max: "100", min: "3" },
    lastName: { type: "string", optional: false, max: "100", min: "3" },
    RolesArray: { type: "array", optional: false, max: "3", min: "1" },
    Token: { type: "string", optional: true },
  }
  const v = new Validator();
  console.log('2');
  const validationResponse = v.validate(jsonValues, schema);
  if (validationResponse !== true) {
    return response.status(400).json({
      message: "Validation Failed",
      errors: validationResponse
    });
  }
  var arrayValues = Object.values(jsonValues);
  mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
    if (err) {
      response.status(501).json({
        message: "Something went wrong",
        error: err
      });
    }
    response.status(201).json({
      message: "Added Successfully",
      roles: rows
    });
    
    var userId = 0;
    
    fetch(process.env.EMAIL_API_ + 'auth/signup/' + jsonValues.email, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then((data) => {
        userId = data.found;
        if (jsonValues.RolesArray[0] && userId > 0) {
          fetch(process.env.EMAIL_API_ + 'auth/signup/roleV', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: userId,
            })
          })
            .then(res => res.json())
            .then((data) => {
              console.log(data);
            }, (error) => {
              console.log(error);
            });
        };
        if (jsonValues.RolesArray[1] && userId > 0) {
          fetch(process.env.EMAIL_API_ + 'auth/signup/roleE', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': jsonValues.Token
            },
            body: JSON.stringify({
              userId: userId
            })
          })
            .then(res => res.json())
            .then((data) => {
              console.log(data);
            }, (error) => {
              console.log(error);
            });
        };
        console.log('userId: ', userId);
        if (jsonValues.RolesArray[2] && userId > 0) {
          fetch(process.env.EMAIL_API_ + 'auth/signup/roleA', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': jsonValues.Token
            },
            body: JSON.stringify({
              userId: userId
            })
          })
            .then(res => res.json())
            .then((data) => {
              console.log(data);
            }, (error) => {
              console.log(error);
            });
        };
      }, (error) => {
        console.log(error);
      });
  });
  // To Test in Postman use POST with this URL "http://localhost:49146//api/auth/signup"
  // in "Body" use raw and select JSON, put this JSON: {"DepartmentName": "BPO"}
  // Run again the GET option to check the list of records
});

// Export the routeAuth
module.exports = routeAuth;
