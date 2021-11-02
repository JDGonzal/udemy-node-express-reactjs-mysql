const express = require('express');
const { request, response } = require('express');
const routeEmployee = express.Router();
const Validator = require('fastest-validator');

// Import middlewares
const auth = require('../middleware/auth.js');
const { admin, editor, viewer } = require("../middleware/roles.js");
const mysqlConnection = require('../utils/database.js');

routeEmployee.get('/api/employee', [auth, viewer], (request,response)=>{
  var query= `SELECT * from mytestdb.Employee`;
  mysqlConnection.query(query, (err,rows, fields) =>{
    if (err){
      response.status(501).json({
        message: "Something went wrong",
        error: err
      });
    }
    response.send(rows);
  });
  // To Test in Postman use a GET with this URL "http://localhost:49146/api/employee"
  // in "Body" use none
});

routeEmployee.post('/api/employee', [auth, editor], (request,response)=>{
  var query= `INSERT into mytestdb.Employee
              (EmployeeName, Department, DateOfJoining, PhotoFileName)
              VALUE (?,?,?,?)`;
  var jsonValues ={
    EmployeeName: request.body['EmployeeName'],
    Department: request.body['Department'],
    DateOfJoining: new Date(request.body['DateOfJoining']),
    PhotoFileName: request.body['PhotoFileName'],
  };
  const schema = {
    EmployeeName:{type:"string", optional:false, max:"100", min:"3"},
    Department:{type:"string", optional:false, max:"100", min:"2"},
    DateOfJoining:{type:"date", optional:false},
    PhotoFileName:{type:"string", optional:false, max:"50", min:"5"}
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
  // To Test in Postman use POST with this URL "http://localhost:49146/api/employee"
  // in "Body" use raw and select JSON, put this JSON: {"EmployeetName": "Max", "Department": "Support", 
  //      "DateOfJoining": "2021-09-12", "PhotoFileName": "filename.png"}
  // Run again the GET option to check the list of records
});

routeEmployee.put('/api/employee', [auth, editor], (request,response)=>{
  var query= `UPDATE mytestdb.Employee
               set EmployeeName=?,
               Department=?,
               DateOfJoining=?,
               PhotoFileName=?
               where EmployeeId=?`;
  
  var jsonValues ={
    EmployeeName: request.body['EmployeeName'],
    Department: request.body['Department'],
    DateOfJoining: new Date(request.body['DateOfJoining']),
    PhotoFileName: request.body['PhotoFileName'],
    EmployeeId: request.body['EmployeeId']
  };

  const schema = {
    EmployeeName:{type:"string", optional:false, max:"100", min:"3"},
    Department:{type:"string", optional:false, max:"100", min:"2"},
    DateOfJoining:{type:"date", optional:false},
    PhotoFileName:{type:"string", optional:false, max:"50", min:"5"},
    EmployeeId:{type:"number", optional:false}
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
  // To Test in Postman use PUT with this URL "http://localhost:49146/api/employee"
  // in "Body" use raw and select JSON, put this JSON:{"EmployeeId": 2,"EmployeeName": "Sam",
  //        "Department": "Support","DateOfJoining": "2021-09-13","PhotoFileName": "filename.png"}
  // Run again the GET option to check the list of records
});

routeEmployee.delete('/api/employee/:id', [auth, admin], (request,response)=>{
  var query= `DELETE from mytestdb.Employee
               where EmployeeId=?`;
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
