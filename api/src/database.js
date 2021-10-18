const mysql = require('mysql');
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cascade',
  database: 'mytestdb'
});

const passwordEncrypt = require('./generatePassword.js');

mysqlConnection.connect(function(err){
  if(err) {
    console.log(err);
    return;
  } else {
    console.log('DB is connected');
    passwordEncrypt('123').then(console.log); //$2b$15$Igd1g/6ky4XAlm41urkPPuDq/.LKTvWIDT5mxW1U6CJKIIgCsCCUq
  }
})

module.exports = mysqlConnection;