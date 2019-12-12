const express = require("express");
const pro = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const router = express.Router();
pro.use(express.static("public"));
pro.set("view engine", "ejs");
pro.set("views", path.join(__dirname, "views"));
pro.use(bodyParser.urlencoded({ extended: false }));
pro.use(session({ secret: "ssshhhhh" }));
let msg = "";
let msg2= "";

pro.get("/", function(req, res) {
  var sess = req.session;
  msg="";
  res.render("login", {
    msg: msg
  });
});
pro.get("/registration", function(req, res) {
  msg="";
  res.render("registration", {
    msg: msg
  });
});
pro.get("/action", function(req, res) {
  res.render("action", {});
});
pro.get("/conjuring", function(req, res) {
  res.render("conjuring", {msg2: msg2});
});
pro.get("/darkknight", function(req, res) {
  res.render("darkknight", {msg2: msg2});
});
pro.get("/drama", function(req, res) {
  res.render("drama", {});
});
pro.get("/error", function(req, res) {
  res.render("error", {});
});
pro.get("/fightclub", function(req, res) {
  res.render("fightclub", {msg2: msg2});
});
pro.get("/godfather", function(req, res) {
  res.render("godfather", {msg2: msg2});
});
pro.get("/godfather2", function(req, res) {
  res.render("godfather2", {msg2: msg2});
});
pro.get("/home", function(req, res) {
  res.render("home", {});
});
pro.get("/horror", function(req, res) {
  res.render("horror", {});
});
pro.get("/index", function(req, res) {
  res.render("index", {});
});
pro.get("/scream", function(req, res) {
  res.render("scream", {msg2: msg2});
});
pro.get("searchresults", function(req, res) {
  res.render("searchresults", {});
});
pro.get("/watchlist", function(req, res) {
  //var gotin = false;
  var sess = req.session;
  let users = loadUsers();
  let arrwatch = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].userr == sess.username && users[i].passw == sess.password) {
      arrwatch = users[i].watchlst;
      //res.render("watchlist", { arrwatch: arrwatch });
      // gotin = true;
      break;
    }
  }
  res.render("watchlist", { arrwatch: arrwatch });
});

let loadUsers = function() {
  try {
    let bufferedData = fs.readFileSync("user.json");
    let dataString = bufferedData.toString();
    let usersArray = JSON.parse(dataString);
    return usersArray;
  } catch (error) {
    return [];
  }
};

let addUser = function(user) {
  //load tasks array
  let users = loadUsers();
  //push new task in array
  users.push(user);
  //save array back in file
  fs.writeFileSync("user.json", JSON.stringify(users));
};

pro.post("/log", function(req, res) {
  var exist = false;
  var pass = false;
  let users = loadUsers();
  var home = false;
  var sess = req.session;
  sess.username = req.body.username;
  sess.password = req.body.password;
  if (sess.username.length == 0) {
    msg = "you should enter a username";
  }
  if (sess.password.length == 0) {
    msg = "you should enter a password";
  } else {
    for (let i = 0; i < users.length && !exist; i++) {
      if (users[i].userr == sess.username) {
        exist = true;
        if (!users[i].passw == sess.password) {
          msg = "password is incorrect";

          break;
        } else {
          pass = true;
        }
      }
    }
    if (!exist) {
      msg = "this username doesn't exist";
    }

    if (exist && pass) {
      res.render("home");
      home = true;
    }
  }

  if (!home) {
    res.render("login", { msg: msg });
  }
});
pro.post("/register", function(req, res) {
  msg = "registration is complete";

  let users = loadUsers();
  var exist = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].userr == req.body.username) {
      exist = true;
      msg = "username already exists";
      break;
    }
  }
  if (req.body.username.length == 0) {
    exist = true;
    msg = "you should enter a username";
  }
  if (req.body.password.length == 0) {
    exist = true;
    msg = "you should enter a password";
  }
  if (!exist) {
    var userob = {
      userr: req.body.username,
      passw: req.body.password,
      watchlst: []
    };
    addUser(userob);
  }
  res.render("registration", { msg: msg });
  //res.redirect('/')
});
let allmovies = [
  "darkknight",
  "fightclub",
  "godfather",
  "godfather2",
  "scream",
  "conjuring"
];

pro.post("/search", function(req, res) {
  var sub = req.body.Search;
  var movies = [];
  var msg ="";
  for (let i = 0; i < allmovies.length; i++) {
    if (allmovies[i].includes(sub)) {
      movies.push(allmovies[i]);
    }
  }
  if(movies.length==0)
  msg="Movie not found";

  res.render("searchresults", { movies: movies , msg:msg});
});

pro.post("/darkknight", function(req, res) {
  var sess = req.session;
  var msg2 ="";
  let users = loadUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].userr == sess.username && users[i].passw == sess.password){
      if(users[i].watchlst.includes("darkknight"))
        msg2="error, movie is Already in your Watchlist";
      else
        users[i].watchlst.push("darkknight");
    }
  }
  fs.writeFileSync("user.json", JSON.stringify(users));
  res.render("darkknight", {msg2:msg2});
});

pro.post("/fightclub", function(req, res) {
  var msg2 ="";
  let users = loadUsers();
  var sess = req.session;
  for (let i = 0; i < users.length; i++) {
    if (users[i].userr == sess.username && users[i].passw == sess.password){
      if(users[i].watchlst.includes("fightclub"))
        msg2="error, movie is Already in your Watchlist";
      else
        users[i].watchlst.push("fightclub");
    }
  }
  fs.writeFileSync("user.json", JSON.stringify(users));
  res.render("fightclub", {msg2: msg2});
});
pro.post("/godfather", function(req, res) {
  var msg2 ="";
  var sess = req.session;
  let users = loadUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].userr == sess.username && users[i].passw == sess.password){
      if(users[i].watchlst.includes("godfather"))
        msg2="error, movie is Already in your Watchlist";
      else
        users[i].watchlst.push("godfather");
    }
  }
  fs.writeFileSync("user.json", JSON.stringify(users));
  res.render("godfather", {msg2: msg2});
});
pro.post("/godfather2", function(req, res) {
  var msg2 ="";
  var sess = req.session;
  let users = loadUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].userr == sess.username && users[i].passw == sess.password){
      if(users[i].watchlst.includes("godfather2"))
        msg2="error, movie is Already in your Watchlist";
      else
        users[i].watchlst.push("godfather2");
    }
  }
  fs.writeFileSync("user.json", JSON.stringify(users));
  res.render("godfather2", {msg2: msg2});
});
pro.post("/conjuring", function(req, res) {
  var msg2 ="";
  var sess = req.session;
  let users = loadUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].userr == sess.username && users[i].passw == sess.password){
      if(users[i].watchlst.includes("conjuring"))
        msg2="error, movie is Already in your Watchlist";
      else
        users[i].watchlst.push("conjuring");
    }
  }
  fs.writeFileSync("user.json", JSON.stringify(users));
  res.render("conjuring", {msg2: msg2});
});
pro.post("/scream", function(req, res) {
  var msg2 ="";
  var sess = req.session;
  let users = loadUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].userr == sess.username && users[i].passw == sess.password){
      if(users[i].watchlst.includes("scream"))
        msg2="error, movie is Already in your Watchlist";
      else
        users[i].watchlst.push("scream");
    }
  }
  fs.writeFileSync("user.json", JSON.stringify(users));
  res.render("scream", {msg2: msg2});
});
var port=process.env.PORT || 3000
pro.listen(port, () => {
  console.log("server is running");
});
