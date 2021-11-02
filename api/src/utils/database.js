const mysql = require('mysql');
require("dotenv").config(); // import config = require('config');
//const passwordEncrypt = require('./utils/generatePassword.js')
//const sendEmail= require("./utils/email.js");
const mysqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_D_B_
});

mysqlConnection.connect(function(err){
  if(err) {
    console.log(err);
    return;
  } else {
    console.log('DB is connected');

    const user ='anyName'; 
    //API_URL, same value of /my-app/src/variables.jsjj
    //const message = `${process.env.EMAIL_API_}user/verify/${user}/${process.env.EMAIL_TOKEN}`;
    // passwordEncrypt('any@tal.com').then(console.log);
    //const urlRoute=`${process.env.EMAIL_APP_}token?value=$2a$08$wZzUyqCqEuBsIMqgEjJmIuxfnnyyk60KGo7kREMDxcDJOYisXRwsa&Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZXMiOlsidmlld2VyIiwiZWRpdG9yIiwiYWRtaW4iXSwiaWF0IjoxNjM1ODU4MTc4LCJleHAiOjE2MzU5NDQ1Nzh9.-ApbUK0gvFpjsZrSSJrBzZ5DDPNDRu-h9jYKsfurNG4`;
    //sendEmail(process.env.EMAIL_TO, "Verify Email", urlRoute,0);
  }
})

module.exports = mysqlConnection;