// Import dependencies
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");

// Setup the express server routeAuth
const routeAuth = express.Router();

// On post
routeAuth.post("/api/auth", async (req, res) => {
    // Dummy data
    const users = [{ email: "im.user@no.matter.com", password: "$2b$15$zqY2Q4eOoGzFpZkHJz9HS.BSfXc/HM2E/yTWa1awFmTMgN2bE72Uu", roles: ["admin", "editor", "viewer"] }];

    // Get to user from the database, if the user is not there return error
    let user = users.find(u => u.email === req.body.email);
    if (!user) throw new Error("Invalid email or password.");

    // Compare the password with the password in the database
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) throw new Error("Invalid email or password.");

    const token = jwt.sign({
        id: user._id,
        roles: user.roles,
    }, "jwtPrivateKey", { expiresIn: "15m" });//Expires in 15 minutes

    res.send({
        ok: true,
        token: token
    });
    var date = new Date();
    console.log(date.toLocaleString());
    console.log(new Date(date.getTime()+15*60000).toLocaleString());
    console.log(token);
});

// Export the routeAuth
module.exports = routeAuth;
