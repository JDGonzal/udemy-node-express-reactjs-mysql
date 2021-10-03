var Express = require('express');
var bodyParser = require('body-parser');
const { request, response } = require('express');

var app= Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends:true}));

var cors = require('cors');
app.use(cors());

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cascade',
  database: 'mytestdb'
});

app.listen(49146,()=>{
  connection.connect(function(err){
    if(err) throw err;
    console.log('Connected to DB');
  })
});

app.get('/',(request,response)=>{
  response.send('Hello World');
});
