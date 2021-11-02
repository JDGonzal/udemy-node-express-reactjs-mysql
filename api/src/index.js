const express = require('express');
// var bodyParser = require('body-parser'); // It is not necessary 
const { request, response } = require('express');

const app= express();

// Settings
app.set('port', process.env.PORT || 49146)
var cors = require('cors');
app.use(cors());
// Middleware
app.use(express.json()); // app.use(bodyParser.json());
// app.use(express.urlencoded({extends:true})); // app.use(bodyParser.json());

// Routes
app.use(require('./routes/department.routes.js'));
app.use(require('./routes/employee.routes.js'));
app.use(require('./routes/auth.routes.js'));
app.use(require('./routes/roles.routes.js'));

//Starting the server
app.listen(app.get('port'),()=>{
  console.log('Server on port ',app.get('port'))
});

app.get('/',(request,response)=>{
  response.send('Hello World');
});

app.get('/api/',(request,response)=>{
  response.send('The API is available');
});

