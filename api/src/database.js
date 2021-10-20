const mysql = require('mysql');
require("dotenv").config(); // import config = require('config');
const mysqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_D_B_
});

const passwordEncrypt = require('./generatePassword.js');
const sendEmail = require("./utils/email.js");

mysqlConnection.connect(function(err){
  if(err) {
    console.log(err);
    return;
  } else {
    console.log('DB is connected');
    passwordEncrypt('123').then(console.log);
    const user ='anyName'; 
    //API_URL, same value of /my-app/src/variables.jsjj
    const message = `${process.env.API_URL}user/verify/${user}/${process.env.EMAIL_TOKEN}`;
    sendEmail(process.env.EMAIL_TO, "Verify Email", message);
  }
})

module.exports = mysqlConnection;