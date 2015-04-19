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
//User clicks to add new cats..
app.get("/cat/add", function(req, res) {
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
app.get("/cat/add/error", function(req, res) {
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
//Want to see a specific Category's page.
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
          console.log(cD);
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

// Upon viewing actual blogpost
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
                  var error = {
                    text: "Yep!",
                  };
                  res.render("showCatPosts.ejs", {
                    cat: cData,
                    post: pData,
                    comments: mData,
                    users: userlist,
                    error: error
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
//ERROR
app.get("/cat/:cid/post/:id/error", function(req, res) {
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
                  var error = {
                    text: "Nope!"
                  };
                  res.render("showCatPosts.ejs", {
                    cat: cData,
                    post: pData,
                    comments: mData,
                    users: userlist,
                    error: error
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
          var error = {
            text: "good",
          };
          res.render("editPost.ejs", {
            post: cPost,
            comments: cData,
            error: error
          });
        }
      });
    }
  });
});
//When user clicks on EDIT THIS POST
app.get("cat/:cid/post/:id/edit", function(req, res) {
  var editID = req.params.id;
  var catID = req.params.cid;
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
          var error = {
            text: "Nope!"
          };
          res.render("editPost.ejs", {
            post: cPost,
            comments: cData,
            error: error,
          });
        }
      });
    }
  });
});
//User Form
app.get("/user/new", function(req, res) {
  var error = {
    text: "good",
  };
  res.render("addUser.ejs", {
    error: error
  });
});
app.get("/user/new/e", function(req, res) {
  var error = {
    text: "Nope!"
  };
  res.render("addUser.ejs", {
    error: error
  });
});

//Upon clicking on add link and you are wrong.
app.get("/cat/:id/post/add/error", function(req, res) {
  var catID = req.params.id;
  db.all("SELECT * FROM users;", function(err, uData) {
    if (err) console.log(err);
    else {
      var uD = uData;
      db.get("SELECT * FROM cats INNER JOIN users ON cats.userID=users.id WHERE cats.id = (?);", catID, function(err, catData) {
        var cD = catData;
        var error = {
          text: "Nope!"
        };
        res.render("addPost.ejs", {
          cat: cD,
          users: uD,
          error: error,
        });
      });
    }
  });
});

//Upon clicking on add link for blogposts...
app.get("/cat/:id/post/add", function(req, res) {
  var catID = req.params.id;
  db.all("SELECT * FROM users;", function(err, uData) {
    if (err) console.log(err);
    else {
      var uD = uData;
      db.get("SELECT * FROM cats INNER JOIN users ON cats.userID=users.id WHERE cats.id = (?);", catID, function(err, catData) {
        var cD = catData;
        var error = {
          text: "Good"
        };
        res.render("addPost.ejs", {
          cat: cD,
          users: uD,
          error: error,
        });
      });
    }
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

// upon request of adding a new article is made.
app.post("/cat/:id/post/add", function(req, res) {
  console.log(req.params.id);
  // console.log("BODYBODYBODY" + JSON.stringify(req.body));
  db.get("SELECT * FROM users WHERE email= (?)", req.body.inputEmail, function(err, udata) {
    console.log(udata);
    if (req.body.pw === udata.password) {
      console.log("verified pw");
      db.run("INSERT INTO posts (Ptitle, Pbody, PimageUrl, timeLive, timeSticky, userID, catID, tagA, tagB, tagC, Pvote, created_atP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)", req.body.Ptitle, req.body.Pbody, req.body.PimageUrl, req.body.tTL, req.body.sticky, udata.id, req.params.id, req.body.tagA.toLowerCase().trim(), req.body.tagB.toLowerCase().trim(), req.body.tagC.toLowerCase().trim(), function(err) {
        if (err) console.log(err);
        else {
          console.log("added");
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/cat/" + req.params.id + "/post/add/error");
    }
  });
});

//Upon clicking: edit this particular blogpost (source:index,view)
//upon Request to make a new CATEGORY!
app.post("/cat", function(req, res) {
  console.log(req.body);
  db.get("SELECT * FROM users WHERE email= (?)", req.body.inputEmail, function(err, udata) {
    console.log(udata);
    if (req.body.pw === udata.password) {
      db.run("INSERT INTO cats (Ctitle, Cbody, CimageUrl, userID, tagA, tagB, tagC, Cvote, created_atC) VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)", req.body.Ctitle, req.body.Cbody, req.body.CimageUrl, udata.id, req.body.tagA.toLowerCase().trim(), req.body.tagB.toLowerCase().trim(), req.body.tagC.toLowerCase().trim(), function(err) {
        if (err) console.log(err);
        else res.redirect("/");
      });
    } else {
      res.redirect("/cat/add/error");
    }
  });
});
//upon adding a comment to a post.
app.post("/cat/:cid/post/:id", function(req, res) {
  var comID = req.params.id;
  console.log(comID);
  console.log(req.body);
  db.get("SELECT * FROM users WHERE email= (?)", req.body.inputEmail, function(err, udata) {
    console.log(udata);
    if (req.body.pw === udata.password) {
      console.log("verified pw");
      db.run("INSERT INTO comments (titleM, userID, bodyM, postID, Mvote, created_atM) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)", req.body.mTitle, udata.id, req.body.mBody, comID, function(err, data) {
        if (err) console.log(err);
        else {
          console.log(data);
          res.redirect("/cat/" + req.params.cid + "/post/" + comID);
        }
      });
    } else {
      res.redirect("/cat/" + req.params.cid + "/post/" + comID + "/error");
    }
  });
});

//User creation
app.post("/user/new", function(req, res) {
  console.log(req.body);
  // db.all("SELECT * FROM users;", function(err, users) {
  //   users.forEach(function(user) {
  //     //will eventually lead to a different error Page
  //     if (user.email === req.body.email) {
  //       console.log("made it to EMAIL check");
  //       res.redirect("/user/new/e");
  //       res.end();
  //       return ("sorry");
  //       //will eventually lead to a different error Page
  //     } else if (user.userN === req.body.userN) {
  //       console.log("made it to USER check");
  //       res.redirect("/user/new/e");
  //       res.end();
  //       return ("sorry");
  //     } else if (req.body.password !== req.body.password1) {
  //       console.log("made it to PASSWORD check");
  //       res.redirect("/user/new/e");
  //     } else {
  db.run("INSERT INTO users (firstN, lastN, userN, email, imageUrl, image, password, Uvote, avatar, created_atU) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP)", req.body.firstN, req.body.lastN, req.body.userN, req.body.email, req.body.imageUrl, req.body.pw, function(err) {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
});

//upon click on edit this article Source: (index/show) Leads:(Home, Delete, Edit)
app.put("/cat/:cid/post/:id/", function(req, res) {
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

//UPON Submitting the EDIT COMMENT FORM!
app.put("/post/:id/comment/", function(req, res) {
  var comID = parseInt(req.body.id, 10),
    postID = parseInt(req.params.id, 10),
    newBod = req.body.body.trim(),
    newTitle = req.body.title.trim(),
    newID = req.body.userID.trim();
  console.log(req.body);
  console.log(req.params.id);
  db.all("UPDATE comments SET Mbody = (?), Mtitle = (?), WHERE id= (?)", newBod, newTitle, newID, comID, function(err, data) {
    if (err) console.log(err);
    else {
      console.log(data);
      res.redirect("/post/" + postID);
    }
  });
});
//User creation
//upon click on an upvote:
app.put("/vote", function(req, res) {
  var direction;
  db.get("SELECT * FROM users WHERE email= (?)", req.body.inputEmail, function(err, udata) {
    console.log(udata);
    
    if (req.body.pw === udata.password) {
      console.log("verified pw");
      var bodice = [];
      for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          bodice.push(key);
        }
      }
      console.log(bodice[2]);
      var votePiece = bodice[2].split(",");
      console.log("votePIECE" + votePiece);
      if (votePiece[2] === "up"){
        direction++;
      } 
      else if(votePiece[2]==="down"){
        direction--;
      }
      if (votePiece[0] === "cat") {
        db.run("UPDATE cats SET Cvote=Cvote+" + direction + " WHERE created_atC = (?);", votePiece[1], function(err) {
          if (err) console.log(err);
          else res.redirect("/");
        });
      } else if (votePiece[0] === "post") {
        db.run("UPDATE posts SET Pvote=Pvote+" + direction + " WHERE created_atP = (?);", votePiece[1], function(err) {
          if (err) console.log(err);
          else res.redirect("/");
        });
      } else if (votePiece[0] === "user") {
        db.run("UPDATE users SET Uvote=Uvote+" + direction + " WHERE created_atU = (?);", votePiece[1], function(err) {
          if (err) console.log(err);
          else res.redirect("/");
        });
      } else if (votePiece[0] === "comment") {
        db.run("UPDATE comments SET Mvote=Mvote+" + direction + " WHERE created_atM = (?);", votePiece[1], function(err) {
          if (err) console.log(err);
          else res.redirect("/");
        });
      }
    } else {
      res.redirect("/");
    }
  });
});

app.delete("/post/:id/comment/:mid", function(req, res) {
  var postID = req.params.id,
    comID = req.body.mid;
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
//Upon click of delete button for a specific article.
app.delete("/cat/:id", function(req, res) {
  db.get("DELETE FROM cats WHERE ID= (?)", req.params.id, function(err, deleted) {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
});
app.listen(port, function() {
  console.log("listening on Port: " + port);
});