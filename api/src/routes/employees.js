const express = require('express');
const { request, response } = require('express');
const routeEmployee = express.Router();
// var cors = require('cors');
// routeEmployee.use(cors());
const mysqlConnection = require('../database.js');

routeEmployee.get('/api/employee',(request,response)=>{
  var query= `SELECT * from mytestdb.Employee`;
  mysqlConnection.query(query, (err,rows, fields) =>{
    if (err){
      response.send('Failed');
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

routeEmployee.post('/api/employee',(request,response)=>{
  var query= `INSERT into mytestdb.Employee
              (EmployeeName, Department, DateOfJoining, PhotoFileName)
              VALUE (?,?,?,?)`;
  var values =[
    request.body['EmployeeName'],
    request.body['Department'], 
    request.body['DateOfJoining'], 
    request.body['PhotoFileName']
  ];
  mysqlConnection.query(query, values, function(err,rows, fields){
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

routeEmployee.put('/api/employee',(request,response)=>{
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
  mysqlConnection.query(query, values, function(err,rows, fields){
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

routeEmployee.delete('/api/employee/:id',(request,response)=>{
  var query= `DELETE from mytestdb.Employee
               where EmployeeId=?`;
  var values =[
    parseInt(request.params.id)
  ];
  mysqlConnection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Deleted Successfully');
  });
  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/Employee/2"
  // in "Body" use none
  // Run again the GET option to check the list of records
});

const fileUpload = require('express-fileupload');
const fs = require('fs');
const photoRoute = './photos';
routeEmployee.use(fileUpload());
routeEmployee.use('/photos', express.static(photoRoute));

routeEmployee.post('/api/employee/savefile', (request, response)=>{
  console.log(photoRoute);
  fs.writeFile('./photos/'+request.files.file.name,
  request.files.file.data,function(err){
    if(err){
      console.log(err);
      return;
    }
    response.json(request.files.file.name);
  });
  // To Test in Postman use POST whit this URL "http://localhost:49146/api/employee/savefile"
  // in "Body" use form-data, put in KEY: "file", press [Select File] button
})


module.exports = routeEmployee;
