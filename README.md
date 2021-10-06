# Learning Node, Express, React JS & MySQL full stack web development

learn to create a full stack web application from scratch using React JS, Node, Express JS and MySQL

Exercises based on this site 
[Node, Express, React JS & MySQL full stack web development](https://www.udemy.com/share/105bJo3@bRAZb_kbYN2z9I8tJYWuD_Lj6uQJpiv3Njcqa0s1lzt8YWLQoMXDc20NO08L3hlT/)


## Steps to start
1. Install NPM and NODEJS in your system 
  [Nodejs Download](https://nodejs.org/en/download/current/)
2. Check in $path or %path% the nodeJS and npm are on it
  ```bash
  C:\Program Files\nodejs
  ```
3. Install Postman
  [Postman Download](https://www.postman.com/downloads/)
4. Install MySQL 5.6.x
  [MySQL Download 5.6.26](https://downloads.mysql.com/archives/community/)
5. Install Visual Studio Code
  [Visual Studio Download](https://code.visualstudio.com/insiders/)
6. Create a DB called "mytestdb" and
  Run the query in MySQL into the "mytestdb" DB
  ```bash
    create table mytestdb.Department(
      DepartmentId int AUTO_INCREMENT,
      DepartmentName nvarchar(500),
      PRIMERY KEY(DepartmentId))
    );
    insert into mytestdb.Department(DepartmentName) values ('IT');
    insert into mytestdb.Department(DepartmentName) values ('Support');
    select * from dbo.Department;

    create table mytestdb.Employee(
      EmployeeId int AUTO_INCREMENT,
      EmployeeName nvarchar(500),
      DateOfJoining datetime,
      PhotoFileName nvarchar(500),      
      PRIMERY KEY(EmployeeId))
    );
    insert into mytestdb.Employee(EmployeeName, department, DateofJoining, PhotoFileName) 
    values ('Bob','IT', '2021-06-21', 'anonymous.png');
    select * from mytestdb.Employee;
  ```
7. In the working directory activate the environment:
  ```bash
  npm init -y
  ```
8. Install express using npm
  ```bash
  npm install express --save
  ```
8. Install body-parser using npm
  ```bash
  npm install body-parser --save
  ```
9. create a file in root, called "index.js"

10. Finally in the stetp 7 of the course run this
  ```bash
    node index.js
  ``` 
11. Using the Postmant locate this route "http://localhost:49146", it must show "Hello World" message 

12. Enable CORS
  ```bash
  npm install cors --save
  ```

13. Install with npm the "mysql"
  ```bash
  npm install mysql --save
  ```
14. create in your project a direcory called "photos", there will store the PNG pictures (ej. anonymous.png, filename.png)

15. Install with npm the "express-fileupload"
  ```bash
  npm install express-fileupload --save
  ```
## Note:
At the end run this command to up the app
  ```bash
  node index.js
  ```

## License
[MIT](https://choosealicense.com/licenses/mit/)
