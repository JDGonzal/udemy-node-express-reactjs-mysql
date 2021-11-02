// Import dependencies
const express = require("express");
const { request, response } = require('express');
const bcrypt = require("bcryptjs");
const Validator = require('fastest-validator');
require("dotenv").config(); // import config = require('config');
const jwt = require("jsonwebtoken");
const fetch = require('cross-fetch');

// Import middlewares
const passwordEncrypt = require('../utils/generatePassword.js');
const sendEmail = require("../utils/email.js");
const auth = require('../middleware/auth.js');
const { admin, editor, viewer } = require("../middleware/roles.js");
const mysqlConnection = require('../utils/database.js');

// Setup the express server routeAuth
const routeAuth = express.Router();

// On post
routeAuth.post("/api/auth/signin", async (request, response) => {
  var query = `SELECT u.*, (SELECT GROUP_CONCAT(ur.roleId SEPARATOR ', ')
                            FROM user_roles ur 
                          WHERE ur.userId = u.userId) AS userRole
               from mytestdb.Users u
               where email=? or password=?`;
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
    //Validate an existing email and password from DB
    if (!rows) {
      return response.status(400).json({
        message: "Invalid email or password",
        errors: validationResponse
      });
    }
    //The user must be active in true 
    const bytes = Buffer.from(rows[0].isActive);
    const isActive=Boolean(bytes[0]);
    if (!isActive===true) {
      return response.status(400).json({
        message: "Account is pending for activate"      });
    }
    // Compare the password with the password in the database
    const valid = bcrypt.compare(jsonValues.password, rows[0].password);
    if (!valid) {
      return response.status(400).json({
        message: "Invalid password or email",
        errors: validationResponse
      });
    } else {
      let rolesArray = [];
      rows[0].userRole.includes('1') ? rolesArray.push('viewer') : null;
      rows[0].userRole.includes('2') ? rolesArray.push('editor') : null;
      rows[0].userRole.includes('3') ? rolesArray.push('admin') : null;
      console.log('role:', rolesArray);
      const token = jwt.sign({
        id: rows[0].userId,
        roles: rolesArray,
      }, process.env.AUTH_SEED, { expiresIn: "480m" });//Expires in 24 hours

      response.send({
        ok: true,
        token: token
      });
      var date = new Date();
      console.log(date.toLocaleString());
      console.log(new Date(date.getTime() + 24 * 60 * 60000).toLocaleString());
      console.log(token);
    }
  });
  // To Test in Postman use POST with this URL "http://localhost:49146/api/auth/signin
  // in "Body" use raw and select JSON, put this JSON: 
  /* {"email": "xxx@yycom",
      password: "abcd1234"}*/
});

routeAuth.get("/api/auth/signup/:email", async (request, response) => {
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
  // To Test in Postman use GET with this URL "http://localhost:49146/api/auth/signup/im.user@no.matter.com"
  // in "Body" use none
});


routeAuth.post("/api/auth/signup", async (request, response) => {
  var query = `INSERT into mytestdb.Users
              (email,password,firstName,lastName,token,createdAt,updatedAt)
              VALUE (?,?,?,?,?,NOW(),NOW())`;
  var jsonValues = {
    email: request.body['email'].toString().toLowerCase(),
    password: await passwordEncrypt(request.body['password']),
    firstName: request.body['firstName'],
    lastName: request.body['lastName'],
    token: await passwordEncrypt(request.body['email']),
    RolesArray: request.body['Roles'],
    TokenExternal: request.body['TokenExternal'],
  };

  const schema = {
    email: { type: "string", optional: false, max: "100", min: "5" },
    password: { type: "string", optional: false, max: "255", min: "60" },
    firstName: { type: "string", optional: false, max: "100", min: "3" },
    lastName: { type: "string", optional: false, max: "100", min: "3" },
    token: { type: "string", optional: false, max: "255", min: "60" },
    RolesArray: { type: "array", optional: false, max: "3", min: "1" },
    TokenExternal: { type: "string", optional: true },
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
        error: err
      });
    }
    response.status(201).json({
      message: "Added Successfully",
      roles: rows
    });
    const urlRoute = `${process.env.EMAIL_APP_}token?value=${jsonValues.token}&Token=${jsonValues.TokenExternal}`;
    console.log('sendEmail:', urlRoute, 0);
    sendEmail(jsonValues.email, 'Activate account.', urlRoute, 0);
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
              'x-auth-token': jsonValues.TokenExternal
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
              'x-auth-token': jsonValues.TokenExternal
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
  // in "Body" use raw and select JSON, put this JSON: 
  /* {"email": "xxx@yycom",
      password: "abcd1234",
      firstName: "firstName",
      lastName: "lastName",
      RolesArray: ['asmin','editor','viewer'],
      Token: "abc12de36eer84d"*/
});

routeAuth.put("/api/token/activate", [auth, viewer], async (request, response) => {
  var query = `SELECT COUNT(UserId) as found FROM mytestdb.Users
              WHERE token=?`;
  var jsonValues = {
    token: request.body['token'],
  };

  const schema = {
    token: { type: "string", optional: false, max: "60", min: "8" },
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
    if (rows[0].found > 0) {
      query = `UPDATE mytestdb.Users
              set token=null,isActive=true,updatedAt=NOW()
              WHERE token=?`;

      mysqlConnection.query(query, arrayValues, function (err, rows, fields) {
        if (err) {
          response.status(501).json({
            message: "Something went wrong",
            ok: false,
            error: err
          });
        }
        response.status(201).json({
          message: "This account was activated sucessfully.",
          ok: true
        });

      });
    } else {
      response.status(501).json({
        ok: false,
        error: "Error: The user could not exist or was activated previoulsy."
      });
    }
  });
  // To Test in Postman use POST with this URL "http://localhost:49146//api/auth/signup"
  // in "Body" use raw and select JSON, put this JSON: 
  /* {"email": "xxx@yycom",
      password: "abcd1234",
      firstName: "firstName",
      lastName: "lastName",
      RolesArray: ['asmin','editor','viewer'],
      Token: "abc12de36eer84d"*/
});

// Export the routeAuth
module.exports = routeAuth;
