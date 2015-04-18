var ejs = require("ejs");
var express = require("express");

var app = express();
app.set("view_engine", "ejs");
app.use(express.static(__dirname + '/public'));

var port = 3000;


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: false
}));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./db/forum.db");
//console.log(db.all("SELECT * FROM posts"));

var request = require("request");

//Home page of the Blogger Redirects to list of blogposts
app.get("/", function(req, res) {
  res.redirect("/posts");
});

//redirects to here the actual list of articles including edit/add/delete/COMMENT
app.get("/posts", function(req, res) {
  db.all("SELECT * FROM posts;", function(err, dataStoredInPosts) {
    if (err) console.log(err);
    else {
      var pTable = dataStoredInPosts; //console.log(pTable);
      db.all("SELECT * FROM cats", function(err, categsdata) {
        if (err) console.log(err);
        else {
          var cData = categsdata;
          db.all("SELECT * FROM comments", function(err, dataInComments) {
            if (err) console.log(err);
            else {
              var mData = dataInComments;
              console.log(mData);
              res.render("index.ejs", { //sets data retrieved as "posts"
                posts: pTable,
                comments: mData,
                cats: cData,
              });
            }
          });
        }
      });
    }
  });
});
app.get("/cat/:id", function(req, res) {
  //for authentication thing...
  db.all("SELECT * FROM users;", function(err, usersData) {
    if (err) console.log(err);
    else {
      var uD = usersData;
      //What's the info for user who wrote this cat...
      db.get("SELECT * FROM cats INNER JOIN users ON cats.userID=users.id WHERE cats.id = (?);", req.params.id, function(err, catData) {
        if (err) console.log(err);
        else {
          var cD = catData;
          //What's the info for user who wrote this post.
          db.all("SELECT * FROM posts INNER JOIN users ON posts.userID=users.id WHERE posts.catID = (?);", req.params.id, function(err, postsData) {
            if (err) console.log(err);
            else {
              var pD = postsData;
              console.log(postsData);
              var error = {
                text: "oops"
              };
              res.render("showCat.ejs", {
                cat: cD,
                posts: pD,
                users: uD,
                error: error,
              });
            }
          });
        }
      });
    }
  });
});
//User clicks to add new cats..
app.get("/cats/add", function(req, res) {
  db.all("SELECT * FROM users;", function(err, usersData) {
    var uD = usersData;
    var error = {
      text: "Verifying..."
    };
    res.render("addCats.ejs", {
      users: uD,
      error: error
    });
  });
});
//User got password wrong?
app.get("/cats/add/error", function(req, res) {
  db.all("SELECT * FROM users;", function(err, usersData) {
    var uD = usersData;
    var error = {
      text: "Nope!"
    };
    res.render("addCats.ejs", {
      users: uD,
      error: error
    });
  });
});
//upon Request to make a new CATEGORY!
app.post("/cats", function(req, res) {
  console.log(req.body);
  db.get("SELECT * FROM users WHERE id= (?)", req.body.true, function(err, udata) {
    console.log(udata);
    if (req.body.pw === udata.password) {
      db.run("INSERT INTO cats (Ctitle, Cbody, CimageUrl, userID, tagA, tagB, tagC, Cvote, created_atC) VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)", req.body.Ctitle, req.body.Cbody, req.body.CimageUrl, req.body.true, req.body.tagA.toLowerCase().trim(), req.body.tagB.toLowerCase().trim(), req.body.tagC.toLowerCase().trim(), function(err) {
        if (err) console.log(err);
        else res.redirect("/");
      });
    } else {
      res.redirect("/cats/add/error");
    }
  });
});


//upon request of adding a new article is made.
app.post("/posts", function(req, res) {
  var textBody = req.body.body,
    title = req.body.title,
    imageUrl = req.body.imageUrl,
    user = 1; //req.body.user;
  db.run("INSERT INTO posts (title, body, imageUrl, userID, vote, created_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP);", title, textBody, imageUrl, user, function(err, data) {
    if (err) console.log(err);
    else { //console.log(data);
      res.redirect("/posts/");
    }
  });
});

//Upon clicking on add link for blogposts...
app.get("cat/:id/post/add", function(req, res) {
  var catID = req.params.id
  res.render("add.ejs", {
    cat: catID
  });
});

//Upon viewing actual blogpost
app.get("/cat/:cid/post/:id", function(req, res) {
  var postId = req.params.id;
  //console.log(postId);
  //What is the information about the user who wrote this post?
  db.all("SELECT * FROM users;", function(err, udata) {
    if (err) console.log(err);
    else {
      var userlist = udata;
      console.log("this is UserLIST" + userlist);
      db.get("SELECT * FROM cats INNER JOIN users ON cats.userID=users.id WHERE cats.id = (?);", req.params.cid, function(err, dataInCat) {
        if (err) console.log(err);
        else {
          var cData = dataInCat;
          console.log(cData);
          db.get("SELECT * FROM posts INNER JOIN users ON posts.userID = users.id WHERE posts.id = (?);", postId, function(err, dataInPost) {
            if (err) console.log(err);
            else {
              var pData = dataInPost;
              console.log(pData);
              //What is the user's info for these comments?
              db.all("SELECT * FROM comments INNER JOIN users ON comments.userID = users.id WHERE comments.postID= (?);", postId, function(err, dataInComment) {
                if (err) console.log(err);
                else {
                  var mData = dataInComment;
                  console.log(cData);
                  res.render("showCatPosts.ejs", {
                    cat: cData,
                    post: pData,
                    comments: mData,
                    users: userlist,
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

//Upon clicking: edit this particular blogpost (source:index,view)
app.get("/post/:id/edit", function(req, res) {
  var editID = req.params.id;
  console.log(editID);
  db.get("SELECT * FROM posts WHERE id= (?);", editID, function(err, currentData) {
    if (err) console.log(err);
    else {
      var cPost = currentData;
      db.all("SELECT * FROM comments WHERE postID=(?);", editID, function(err, dataInComments) {
        if (err) console.log(err);
        else {
          var cData = dataInComments;
          console.log(cData);
          res.render("editPost.ejs", {
            post: cPost,
            comments: cData
          });
        }
      });
    }
  });
});
//upon adding a comment to a post.
app.post("/post/:id/", function(req, res) {
  var comID = req.params.id;
  console.log(comID);
  console.log(req.body.title + req.body.userID + req.body.body);
  db.run("INSERT INTO comments (Mtitle, userID, Mbody, postID, Mvote, Mcreated_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)", req.body.title, req.body.userID, req.body.body, comID, function(err, data) {
    if (err) console.log(err);
    else {
      console.log(data);
      res.redirect("/post/" + comID);
    }
  });
});
//upon click on an upvote:
app.put("/user/:id/vote", function(req, res) {
  console.log("This is the body" + JSON.stringify(req.body));
  console.log()
});
//upon click on edit this article Source: (index/show) Leads:(Home, Delete, Edit)
app.put("cat/:cid/post/:id/", function(req, res) {
  console.log(req.body);
  var editID = parseInt(req.params.id, 10);
  var textBody = req.body.body;
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  //***IF NOT REJECTED FOR AUTHENTICATION!
  db.get("UPDATE posts SET Ptitle = (?), Pbody = (?), PimageUrl= (?) WHERE id= (?)", title, textBody, imageUrl, editID, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
    res.redirect("/post/" + req.params.id);
  });
});
//upon click of edit these comments!*******
app.get("/post/:id/comments", function(req, res) {
  var postid = parseInt(req.params.id, 10);
  db.all("SELECT * IN comments WHERE postID=(?)", postid, function(err, dataComments) {
    if (err) console.log(err);
    else {
      res.render("editComs.ejs", {
        com: dataComments
      });
    }
  });
});
//UPON Submitting the EDIT COMMENT FORM!
app.put("/post/:id/comment/", function(req, res) {
  var comID = parseInt(req.body.id, 10),
    postID = parseInt(req.params.id, 10),
    newBod = req.body.body.trim(),
    newTitle = req.body.title.trim(),
    newID = req.body.userID.trim();
  console.log(req.body);
  console.log(req.params.id);
  db.all("UPDATE comments SET body = (?), title = (?), userID = (?) WHERE id= (?)", newBod, newTitle, newID, comID, function(err, data) {
    if (err) console.log(err);
    else {
      console.log(data);
      res.redirect("/post/" + postID);
    }
  });
});

app.delete("/post/:id/comment/", function(req, res) {
  var postID = req.params.id,
    comID = req.body.id;
  db.get("DELETE FROM comments WHERE ID = (?);", comID, function(err, deleted) {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
});
//Upon click of delete button of a specific article.
app.delete("/post/:id", function(req, res) {
  var postId = req.params.id;
  console.log(postId);
  db.get("DELETE FROM posts WHERE ID = (?);", postId, function(err, deleted) {
    if (err) console.log(err);
    else {
      res.redirect("/posts");
    }
  });
});

app.listen(port, function() {
  console.log("listening on Port: " + port);
});