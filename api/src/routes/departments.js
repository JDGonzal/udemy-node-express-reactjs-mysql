const express = require('express');
const { request, response } = require('express');
const routeDepartment = express.Router();

const mysqlConnection = require('../database.js');

routeDepartment.get('/api/department',(request,response)=>{
  var query= `SELECT * from mytestdb.Department`;
  mysqlConnection.query(query, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/department"
  // in "Body" use none
});

routeDepartment.post('/api/department',(request,response)=>{
  var query= `INSERT into mytestdb.Department
              (DepartmentName)
              VALUE (?)`;
  var values =[
    request.body['DepartmentName']
  ];
  mysqlConnection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Added Successfully');
  });
  // To Test in Postman use POST with this URL "http://localhost:49146/api/department"
  // in "Body" use raw and select JSON, put this JSON: {"DepartmentName": "BPO"}
  // Run again the GET option to check the list of records
});

routeDepartment.put('/api/department',(request,response)=>{
  var query= `UPDATE mytestdb.Department
               set DepartmentName=? where DepartmentId=?`;
  var values =[
    request.body['DepartmentName'],
    request.body['DepartmentId']
  ];
  mysqlConnection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Updated Successfully');
  });
  // To Test in Postman use PUT with this URL "http://localhost:49146/api/department"
  // in "Body" use raw and select JSON, put this JSON: {"DepartmentName": "BPOX", "DepartmentId": "3"}
  // Run again the GET option to check the list of records
});

routeDepartment.delete('/api/department/:id',(request,response)=>{
  var query= `DELETE from mytestdb.Department
               where DepartmentId=?`;
  var values =[
    parseInt(request.params.id)
  ];
  mysqlConnection.query(query, values, function(err,rows, fields){
    if (err){
      response.send('Failed');
    }
    response.json('Deleted Successfully');
  });
  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/department/3"
  // in "Body" use none
  // Run again the GET option to check the list of records
});

module.exports = routeDepartment;
