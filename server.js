require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const connectString = process.env.MONGO_KEY;
const dbName = "db";
let db;
const bcrypt = require("bcryptjs");

MongoClient.connect(connectString, (err, client) => {
  if (err) {
    console.log(err);
  }
  else {
    db = client.db(dbName);
    console.log("Connected.");
  }
});

app.use(express.json());

app.use(session({
  secret: process.env.SERVER_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.post("/signup", (req, res) => {
  const collection = db.collection("sign_in");
  collection.find({email: req.body.email}).toArray((err, docs) => {
    if (err) {
      console.error(err);
    } else {
      if (docs.length == 0) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.pass, salt);
        req.body.pass = hash;
        collection.insertOne(req.body);
        res.send("OK");
      } else {
        res.send("That username is taken!");
      }
    }
  });
});

app.post("/signin", (req, res) => {
  console.log("A");
  const collection = db.collection("sign_in");
  req.session.loggedIn = false;
  collection.find({email: req.body.email}).toArray((err, docs) => {
    if (err) {
      console.error(err);
    } else {
      if (docs.length == 0) {
        console.log("B");
        res.send("There is no account with that email.");
      } else {
        if (bcrypt.compareSync(req.body.pass, docs[0].pass)) {
          res.send("Incorrect password.");
        } else {
          if (req.body.rememberMe) req.session.rememberMe = true;
          else req.session.rememberMe = false;
          req.session.loggedIn = true;
          req.session.account = docs[0];
          res.send("OK");
        }
      }
    }
  });
});

app.get("/loggedIn", (req, res) => {
  if (req.session.loggedIn) {
    if (!req.session.rememberMe) req.session.loggedIn = false;
    res.send(req.session.account);
  }
  else res.send(JSON.stringify({res: "false"}));
});

app.post("/uploadPost", (req, res) => {
  const collection = db.collection("sign_in");
  collection.insertOne(req.body);
  console.log(req.body);
  res.send("OK");
});

app.post("/getPosts", (req, res) => {
  const collection = db.collection("sign_in");
  let searchTerms = req.body.input.split(" ");
  let relevantPosts = [];
  for (let i = 0; i < searchTerms.length; i++) {
    collection.find().toArray((err, docs) => {
      if (err) {
        console.error(err);
      } else {
        for (let j = 0; j < docs.length; j++) {
          if (docs[j].type == "post") {
            if (docs[j].text.includes("#" + searchTerms[i])) {
              console.log(docs[j].text);
              console.log(searchTerms[i]);
              relevantPosts.push(docs[j]);
            }
          }
          if (i == searchTerms.length - 1 && j == docs.length - 1) res.send(relevantPosts);
        };
      }
    });
  }
});

app.post("/getUserPosts", (req, res) => {
  const collection = db.collection("sign_in");
  collection.find({author: req.body.author, type: "post"}).toArray((err, docs) => {
    if (err) {
      console.error(err);
    } else {
      console.log(docs);
      res.send(docs);
    }
  });
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
