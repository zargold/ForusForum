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
      db.all("SELECT * FROM comments", function(err, dataInComments) {
        if (err) console.log(err);
        else {
          var cData = dataInComments;
          console.log(cData);
          res.render("index.ejs", { //sets data retrieved as "posts"
            posts: pTable,
            comments: cData
          });
        }
      });
    }
  });
});

app.get("/comments", function(req, res) {
  db.all("SELECT * FROM comments;", function(err, dataInComments) {
    if (err) console.log(err);
    else {
      var aCom = dataInComments;
    }
  });
});
//upon request of adding a new article is made.
app.post("/posts", function(req, res) {
  var textBody = req.body.body, title = req.body.title, imageUrl = req.body.imageUrl, user=1;//req.body.user;
  db.run("INSERT INTO posts (title, body, imageUrl, userID, vote, created_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)", title, textBody, imageUrl, user, function(err, data) {
    if (err) console.log(err);
    else { //console.log(data);
      res.redirect("/posts/");
    }
  });
});

//Upon clicking on add link for blogposts...
app.get("/post/add", function(req, res) {
  res.render("add.ejs");
});
//Upon viewing actual blogpost
app.get("/post/:id", function(req, res) {
  var postId = req.params.id;
  //console.log(postId);
  db.get("SELECT * FROM posts INNER JOIN users ON posts.userID = users.id WHERE posts.id = (?);", postId, function(err, dataInPost) {
    if (err) console.log(err);
    else {
      var pData = dataInPost;
      console.log(pData);
      // var posterID= pData.userID;
      // console.log(posterID);
    }
  });
      // db.get("SELECT * FROM users WHERE id=(?);", posterID, function(err, userData){
      //   if(err) console.log(err);
      //   else{
      //     var poster= userData;
      //     console.log(poster);
      // db.all("SELECT * FROM comments WHERE postID=(?);", postId, function(err, dataInComments) {
      //   if (err) console.log(err);
      //   else {
      //     var cData = dataInComments;
      //     var id
      //     console.log(cData);

      //     //var commentorID=cData.userID;
      //     db.all("SELECT * FROM users WHERE id=(?)", commentorID, function(err, usersData){
      //       if(err) console.log(err);
      //       else{
      //         var commentor=usersData;

      //       }
  //         res.render("showCatPosts.ejs", {
  //           post: pData,
  //           comments: cData,
  //           userP: poster,
  //           userC: commentor
  //         });
  //       })
  //       }
  //     });
  //   }
  // });
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
//adding a comment to a particular article... To do this I will require a simple form which allows someone to post to a given postID. There will then have to be an associated comments table in the same database. When someone writes a comment to a particular post it will have to update that comment's PostID (much like an author's ID would appear on the books description) that comment's body (and title in some blogs but usually not...) that comment's user..It should have an automatically generated timestamp. Once a comment is posted to a particular article IF any comments exists they must be displayed on that post's page (along with the user, title, timestamp). Ideally the homepage where all the articles are would have a link with "0 comments" or more written. By clicking on that page the user is directed to: post/:id/comments/ (Ideally there woulde only one page which would allow editing or deleting of all the comments. This may be achieved by having a textbody editor appear for each comment who's postID matches the req.params.id.) In conclusion comments require the following: (id, tag, body, author, postID-set by looking at id of comments written). The count of comments associated with a specific blogpost may be achieved by comments.withpostID(?).length. 
app.post("/post/:id/", function(req, res) {
  var comID = req.params.id;
  console.log(comID);
  console.log(req.body.title + req.body.userID + req.body.body);
  db.run("INSERT INTO comments (title, userID, body, postID, vote, created_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)", req.body.title, req.body.userID, req.body.body, comID, function(err, data) {
    if (err) console.log(err);
    else {
      console.log(data);
      res.redirect("/post/" + comID);
    }
  });
});
//upon click on edit this article Source: (index/show) Leads:(Home, Delete, Edit)
app.put("/post/:id/", function(req, res) {
  var editID = req.params.id;
  var textBody = req.body.body;
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  db.get("UPDATE posts SET title = (?), body = (?), imageUrl= (?) WHERE id= (?)", title, textBody, imageUrl, editID, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
    res.redirect("/post/" + req.params.id);
  });
});

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