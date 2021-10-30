const express = require('express');
const { request, response } = require('express');
const routeDepartment = express.Router();
const Validator = require('fastest-validator');

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, editor, viewer } = require("../middleware/roles.js");
const mysqlConnection = require('../database.js');

routeDepartment.get('/api/department', [auth, viewer], (request,response)=>{
  var query= `SELECT * from mytestdb.Department`;
  mysqlConnection.query(query, function(err,rows, fields){
    if (err){
      response.status(501).json({
        message: "Something went wrong",
        error: err
      });
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/department"
  // in "Body" use none
});

routeDepartment.post('/api/department', [auth, editor], (request,response)=>{
  var query= `INSERT into mytestdb.Department
              (DepartmentName)
              VALUE (?)`;
  var jsonValues ={
    DepartmentName: request.body['DepartmentName']
  };
  const schema = {
    DepartmentName:{type:"string", optional:false, max:"100", min:"2"}
  }
  const v= new Validator();
  const validationResponse = v.validate(jsonValues,schema);

  if (validationResponse !== true){
    return response.status(400).json({
      message: "Validation Failed",
      errors: validationResponse
    });
  }
  var arrayValues=Object.values(jsonValues);
  mysqlConnection.query(query, arrayValues, function(err,rows, fields){
    if (err){
      response.status(501).json({
        message: "Something went wrong",
        error: err
      });
    }
    response.status(201).json({
      message: "Added Successfully",
    });
  });
  // To Test in Postman use POST with this URL "http://localhost:49146/api/department"
  // in "Body" use raw and select JSON, put this JSON: {"DepartmentName": "BPO"}
  // Run again the GET option to check the list of records
});

routeDepartment.put('/api/department', [auth, editor], (request,response)=>{
  var query= `UPDATE mytestdb.Department
               set DepartmentName=? where DepartmentId=?`;
  var jsonValues ={
    DepartmentName: request.body['DepartmentName'],
    DepartmentId: request.body['DepartmentId']
  };
  const schema = {
    DepartmentName:{type:"string", optional:false, max:"100", min:"2"},
    DepartmentId:{type:"number", optional:false}
  }
  const v= new Validator();
  const validationResponse = v.validate(jsonValues,schema);
  if (validationResponse !== true){
    return response.status(400).json({
      message: "Validation Failed",
      errors: validationResponse
    });
  }
  var arrayValues=Object.values(jsonValues);
  mysqlConnection.query(query, arrayValues, function(err,rows, fields){
    if (err){
      response.status(501).json({
        message: "Something went wrong",
        error: err
      });
    }
    response.status(200).json({
      message: "Updated Successfully",
    });
  });
  // To Test in Postman use PUT with this URL "http://localhost:49146/api/department"
  // in "Body" use raw and select JSON, put this JSON: {"DepartmentName": "BPOX", "DepartmentId": "3"}
  // Run again the GET option to check the list of records
});

routeDepartment.delete('/api/department/:id', [auth, admin], (request,response)=>{
  var query= `DELETE from mytestdb.Department
               where DepartmentId=?`;
  var values =[
    parseInt(request.params.id)
  ];
  mysqlConnection.query(query, values, function(err,rows, fields){
    if (err){
      response.status(501).json({
        message: "Something went wrong",
        error: err
      });
    }
    response.status(200).json({
      message: "Deleted Successfully",
    });
  });
  // To Test in Postman use DELETE with this URL "http://localhost:49146/api/department/3"
  // in "Body" use none
  // Run again the GET option to check the list of records
});

module.exports = routeDepartment;
