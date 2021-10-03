var Express = require('express');
var bodyParser = require('body-parser');
const { request, response } = require('express');

var app= Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends:true}));

app.listen(49146,()=>{});

app.get('/',(request,response)=>{
  response.send('Hello World');
});
