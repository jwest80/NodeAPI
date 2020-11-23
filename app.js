// Libraries
const express = require('express');          // Express used for API
const fs = require("fs");                    // Read/Write File Modules
const bodyParser = require('body-parser');   // Read Body of request

// Config
const PORT = 3000;                           // Listen on Port 3000
const DATA_PATH = __dirname + "/data/";      // Store data path

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());


//--------------------------------------------------------
// USERS
//--------------------------------------------------------
let usersD = require('./data/users.json');    // Initialize Users
let users =  JSON.parse(JSON.stringify(usersD));

// USERS - List all Users
app.get('/listUsers', (req, res) => {
   res.send(users);
})

// USERS - Get user by Id
app.get('/:id', (req, res) => {
   let user = users.find(x => x.id.toString() === req.params.id);
   res.send(user);
})

// USERS - Add a user
app.put('/add', (req, res) => {
   let user = {
      id : Math.max(...users.map(user => user.id)) + 1,
      name : req.body.name,
      password : req.body.password,
      profession : req.body.profession
   }
   users.push(user);
   res.send(user);
})

// USERS - Delete a user
app.delete('/:id', function (req, res) {
   let index = users.findIndex(x => x.id.toString() === req.params.id);
   users.splice(index, 1);
   res.send(users);

})

// USERS - Cancel Changes
app.post('/cancel', function(req, res) {
   //Object.assign(users, usersD);
   users =  JSON.parse(JSON.stringify(usersD));

   // fs.readFile(DATA_PATH + "users.json", (err, data) => {
   //    if (err) throw err;
   //    users = data;
   //  });
   res.send("Changes Cancelled");
})

// USERS - Save Changes to File
app.post('/save', function(req, res) {
   fs.writeFile(DATA_PATH + "users.json", JSON.stringify(users, null, 2), function(err) {
      if (err) {
         return console.error(err);
      }
   });
   res.send("User data saved");
})

// USERS - Restore Users file from Backup (Initialize)
app.post('/restore', function(req, res) {
   // Create a readable stream
   var readerStream = fs.createReadStream(DATA_PATH + 'users-backup.json');

   // Create a writable stream
   var writerStream = fs.createWriteStream(DATA_PATH + 'users.json');

   // read input.txt and write data to output.txt
   readerStream.pipe(writerStream);

   users = [];
   readerStream.on('data', function(chunk) {
         users += chunk;
   });

   res.send("User data restored from backup");
})


// Start Server 
var server = app.listen(PORT, function () {
   console.log("Example app listening at http://localhost:%s", PORT)
})