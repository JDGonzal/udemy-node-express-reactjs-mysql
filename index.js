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

//****************************************/
//----------- DEPARTMENT -----------------/
//****************************************/
app.get('/api/department',(request,response)=>{
  var query= `SELECT * from mytestdb.Department`;
  connection.query(query, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/department"
  // in "Body" use none
});

app.post('/api/department',(request,response)=>{
  var query= `INSERT into mytestdb.Department
              (DepartmentName)
              VALUE (?)`;
  var values =[
    request.body['DepartmentName']
  ];
  connection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Added Successfully');
  });
  // To Test in Postman use POST with this URL "http://localhost:49146/api/department"
  // in "Body" use raw and select JSON, put this JSON: {"DepartmentName": "BPO"}
  // Run again the GET option to check the list of records
});

app.put('/api/department',(request,response)=>{
  var query= `UPDATE mytestdb.Department
               set DepartmentName=? where DepartmentId=?`;
  var values =[
    request.body['DepartmentName'],
    request.body['DepartmentId']
  ];
  connection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Updated Successfully');
  });
  // To Test in Postman use PUT with this URL "http://localhost:49146/api/department"
  // in "Body" use raw and select JSON, put this JSON: {"DepartmentName": "BPOX", "DepartmentId": "3"}
  // Run again the GET option to check the list of records
});

app.delete('/api/department/:id',(request,response)=>{
  var query= `DELETE from mytestdb.Department
               where DepartmentId=?`;
  var values =[
    parseInt(request.params.id)
  ];
  connection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Deleted Successfully');
  });
  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/department/3"
  // in "Body" use none
  // Run again the GET option to check the list of records
});

//****************************************/
//------------- EMPLOYEE -----------------/
//****************************************/
app.get('/api/employee',(request,response)=>{
  var query= `SELECT * from mytestdb.Employee`;
  connection.query(query, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

app.post('/api/employee',(request,response)=>{
  var query= `INSERT into mytestdb.Employee
              (EmployeeName, Department, DateOfJoining, PhotoFileName)
              VALUE (?,?,?,?)`;
  var values =[
    request.body['EmployeeName'],
    request.body['Department'], 
    request.body['DateOfJoining'], 
    request.body['PhotoFileName']
  ];
  connection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Added Successfully');
  });
  // To Test in Postman use POST with this URL "http://localhost:49146/api/employee"
  // in "Body" use raw and select JSON, put this JSON: {"EmployeetName": "Max", "Department": "Support", 
  //      "DateOfJoining": "2021-09-12", "PhotoFileName": "filename.png"}
  // Run again the GET option to check the list of records
});

app.put('/api/employee',(request,response)=>{
  var query= `UPDATE mytestdb.Employee
               set EmployeeName=?,
               Department=?,
               DateOfJoining=?,
               PhotoFileName=?
               where EmployeeId=?`;
  var values =[
    request.body['EmployeeName'],
    request.body['Department'],
    request.body['DateOfJoining'],
    request.body['PhotoFileName'],
    request.body['EmployeeId']
  ];
  connection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Updated Successfully');
  });
  // To Test in Postman use PUT with this URL "http://localhost:49146/api/employee"
  // in "Body" use raw and select JSON, put this JSON:{"EmployeeId": 2,"EmployeeName": "Sam",
  //        "Department": "Support","DateOfJoining": "2021-09-13","PhotoFileName": "filename.png"}
  // Run again the GET option to check the list of records
});

app.delete('/api/employee/:id',(request,response)=>{
  var query= `DELETE from mytestdb.Employee
               where EmployeeId=?`;
  var values =[
    parseInt(request.params.id)
  ];
  connection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Deleted Successfully');
  });
  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/Employee/2"
  // in "Body" use none
  // Run again the GET option to check the list of records
});

var fileUpload = require('express-fileupload');
var fs = require('fs');
app.use(fileUpload());
app.use('/photos', Express.static(__dirname+'/photos'));

app.post('/api/employee/savefile', (request, response)=>{

  fs.writeFile('./photos/'+request.files.file.name,
  request.files.file.data,function(err){
    if(err){
      return
      console.log(err);
    }
    response.json(request.files.file.name);
  });
  // To Test in Postman use POST whit this URL "http://localhost:49146/api/employee/savefile"
  // in "Body" use form-data, put in KEY: "file", press [Select File] button
})
