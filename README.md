# Learning Node, Express, React JS & MySQL full stack web development

learn to create a full stack web application from scratch using React JS, Node, Express JS and MySQL

Exercises based on this site 
[Node, Express, React JS & MySQL full stack web development](https://www.udemy.com/share/105bJo3@bRAZb_kbYN2z9I8tJYWuD_Lj6uQJpiv3Njcqa0s1lzt8YWLQoMXDc20NO08L3hlT/)


## Steps to start
1. Install NPM and NODEJS in your system 
  [Nodejs Download](https://nodejs.org/en/download/current/)
2. Check in $path or %path% the nodeJS and npm are on it
  ```bash
  C:/Program Files/nodejs
  ```
3. Install Postman
  [Postman Download](https://www.postman.com/downloads/)
4. Install MySQL 5.6.x
  [MySQL Download 5.6.26](https://downloads.mysql.com/archives/community/)
5. Install Visual Studio Code
  [Visual Studio Download](https://code.visualstudio.com/insiders/)
6. Create a DB called "mytestdb" and
  You could create the DB using an script
  ```sql
    CREATE DATABASE IF NOT EXISTS mytestdb;

    USE mytestdb;
  ```
  Run the query in MySQL into the "mytestdb" DB
  ```sql
    create table mytestdb.Department(
      DepartmentId int AUTO_INCREMENT,
      DepartmentName nvarchar(500) NOT NULL,
      PRIMARY KEY(DepartmentId));

    insert into mytestdb.Department(DepartmentName) values ('IT');
    insert into mytestdb.Department(DepartmentName) values ('Support');
    describe Department;
    select * from Department;

    create table mytestdb.Employee(
      EmployeeId int AUTO_INCREMENT,
      EmployeeName nvarchar(500) NOT NULL,
      Department nvarchar(500) NOT NULL,
      DateOfJoining datetime NOT NULL,
      PhotoFileName nvarchar(500),      
      PRIMARY KEY(EmployeeId));

    insert into mytestdb.Employee(EmployeeName, department, DateofJoining, PhotoFileName) 
    values ('Bob','IT', '2021-06-21', 'anonymous.png');
    describe Employee;
    select * from Employee;
  ```
7. In the working directory activate the environment:
  ```bash
  npm init -y
  ```
8. Install express using npm.<br />
  Express is minimal and flexible Node.js web applicaton framework
  ```bash
  npm install express --save
  ```
9. Create a file in root, called "index.js"

10. Finally run this
  ```bash
    node index.js
  ``` 
11. Using the Postmant locate this route "http://localhost:49146", it must show "Hello World" message 

12. Enable CORS.<br />
  CORS is really useful when you're offering a public API and would like to controll the access to certain resources and how people use them.<br />
  Also, if you want to use your own API or files on a different web page you can simply configure CORS to allow that, while still blocking others out.
  ```bash
  npm install cors --save
  ```

13. Install with npm the "mysql".<br />
  It is the connection to MYSQL data base, installed in step 4 and configured in step 6.
  ```bash
  npm install mysql --save
  ```
14. Create in your project a direcory called "photos", there will store the PNG pictures (ej. anonymous.png, filename.png)

15. Install with npm the "express-fileupload".<br />
  Simple Express middleware for uploading files. It parses multipart/form-data requests, extracts the files if available, and make them available under req. files property. morgan - Node. js middleware for logging HTTP requests
  ```bash
  npm install express-fileupload --save
  ```

16. Create the React JS Projectwith npx 
  ```bash
  npx create-react-app my-app
  ```

17. Add CSS and BUNDLE from this site 
  [Bootstrap Getting Started](https://getbootstrap.com/docs/5.1/getting-started/introduction/)

18. Install with npm the "react-router-dom" inside "my-app" directory.<br />
React Router is a collection of navigational components that compose declaratively with your application.<br />
Whether you want to have bookmarkable URLs for your web app or a composable way to navigate in React Native, React Router works wherever React is rendering.
  ```bash
  cd ./my-app
  npm install react-router-dom 
  ```
19. Create three new files:
  home.js, department.js, employee.js, into the "src" directory

20. Create a new file, to store the API endpoints: variables.js, into the "src" directory

21. locate the icons in "https://icons.getbootstrap.com/", select "Copy HTML" option.<br /> 
After paste , do the correction of "fill-rule" by "fillRule"


## Improvements

1. Move the files into the "api" directory. <br /> 
  they are : index.js, package.json, package-lock.json, and node_modules (directory)



3. in package.json, put in scripts this new line
  ```bash
  "dev": "nodemon src/index.js"
  ```
4. Intall with npm the "fastest-validator".<br />
  Used to validate in API the structure or each field in "body" to process a request.
  ```bash
  cd ./api
  npm install fastest-validator --save
  ```  
5. Intall with npm the "bcryptjs".<br />
  Bcryptjs is Optimized bcrypt in JavaScript with zero dependencies. <br />
  Compatible to the C++ bcrypt binding on node.js and also working in the browser.
  ```bash
  cd ./api
  npm install bcryptjs --save
  ```
6. Intall with npm the "jsonwebtoken".<br />
  JSON Web Tokens (JWT) are an RFC 7519 open industry standard for representing claims between two parties.<br />
  For example, you can use jwt.io to decode, verify, and produce JWT. JWT specifies a compact and self-contained method for communicating information as a JSON object between two parties.
  ```bash
  cd ./api
  npm install jsonwebtoken --save
  ```
7. Create two new files: auth.js and roles.js, into new directory called "middleware"

8. Create into "routes" a new file called auth.js

9. The way to use this new "token" is with a POST to "api/auth".<br />
Using this json: { email: "im.user@no.matter.com", password: "123"} <br /> 
the best way to understand is with a video:
  [How to Create a Secure REST API with Node.js and Express](https://www.youtube.com/watch?v=Tw5LupcpKS4&t=340s)

10. Install with npm the "dotenv".<br />
  It loads environment variables from a .env file.
  ```bash
  cd ./api
  npm install dotenv --save
  ```

11. Install with npm the "nodemailer".<br />
  Nodemailer allow us to send email.
  ```bash
  cd ./api
  npm install nodemailer --save
  ```

12. Create into "api" directory a file called ".env".<br />
  REMEMBER: This file doesn't upload to repository.
  ```java
  #MYSQL CONNECTION
  MYSQL_HOST=________
  MYSQL_USER=________
  MYSQL_PASS=________
  MYSQL_D_B_=________
  ```
13. Create a "email.js" into "/api/utils" directory

14. Add in ".env" file those fields:
  ```java
  #EMAIL INFORMATION
  EMAIL_HOST=smtp.gmail.com
  EMAIL_SERVICE=gmail
  EMAIL_PORT=587
  EMAIL_USER=________
  EMAIL_PASS=________
  EMAIL_FROM=________
  EMAIL_TO=________
  EMAIL_TOKEN=________
  ```

15. Install with npm the "react-bootstrap".<br />
  react-bootstrap, Change some elements as FORM, BUTTON, CONTROL
  ```bash
  cd ./my-app
  npm install react-bootstrap --save
  ```

16. Create a new file called "login.css"

17. Make some changes in "home.js"

18. For the Login Process to DB , crete this table:
  ```sql
  CREATE TABLE mytestdb.Users (
    userId int NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) DEFAULT NULL,
    firstName varchar(255) ,
    lastName varchar(255) ,
    isActive bit DEFAULT 0 NOT NULL,
    token varchar(255),
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL,
    PRIMARY KEY (userId),
    UNIQUE KEY email (email));
  ```
19. To Roles admin create this table:
  ```sql
  CREATE TABLE mytestdb.Roles (
    roleId int NOT NULL DEFAULT '0',
    nameRole varchar(255) NOT NULL,
    createdAt datetime NOT NULL,
    updatedA datetime NOT NULL,
    PRIMARY KEY (roleId));
  INSERT INTO mytestdb.Roles VALUES ('1', 'viewer', NOW(), NOW());
  INSERT INTO mytestdb.Roles VALUES ('2', 'editor', NOW(), NOW());
  INSERT INTO mytestdb.Roles VALUES ('3', 'admin', NOW(), NOW());
  ```
20. We need a Table to mix the values between Users and Roles
  ```sql
  CREATE TABLE mytestdb.User_Roles (
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL,
    roleId int NOT NULL DEFAULT '0',
    userId int NOT NULL DEFAULT '0',
    PRIMARY KEY (`roleId`,`userId`),
    KEY `userId` (`userId`),
    CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES mytestdb.Roles (`roleId`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES mytestdb.Users (`userId`) ON DELETE CASCADE ON UPDATE CASCADE);
  ```
21. Install cross-fetch.<br /> 
  cross-fetch is an universal WHATWG Fetch API for Node, Browsers and React Native. <br /> 
  The scenario that cross-fetch really shines is when the same JavaScript codebase <br /> 
  needs to run on different platforms. Platform agnostic: browsers, Node or React Native.
  ```bash
    npm install cross-fetch --save
  ```
22. A lot of changes, to let use the Login and Submit. There are two modals, one just for Login, ana another for Register.<br /> 
  The user can have access to everything if exist a previos login with an user with all roles. <br /> 
  The user by default will be created as "viewer" (GET), the other permissions are "editor" (POST, PUT) and "admin" (DELETE)

## Note: Run first the API before to run the APP
At the end, run this command to up the API, to check in Postman 'http://localhost:49146/api/',
  ```bash
  cd ./api
  npm run dev
  ```
And run this command to up the APP, using another Terminal, to check http://localhost:8000/
  ```bash
  cd ./my-app
  npm start
  ```
### If you need to check the installed "node_modules" elements, use this :
```
  npm list --depth 0
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
