var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("forum.db");
// cats ( id INTEGER PRIMARY KEY AUTOINCREMENT, Ctitle TEXT, Cbody TEXT, CimageUrl TEXT, userID INTEGER, tagA TEXT, tagB TEXT, tagC TEXT, Cvote INTEGER, updated_atC REAL, created_atC REAL);
db.run("INSERT INTO cats (Ctitle, Cbody, CimageUrl, userID, tagA, tagB, tagC, Cvote, created_atC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", "The Great Adventure", "In the far uncharted backwaters of the outstretched arm of the Milky Way Galaxy sits a small disregarded Yellow Sun orbiting this sun at approximately 30-light-minutes is a round blue green planet whose primitive inhabitants still think digital watches are a pretty neat idea", "http://energitismo.com/wp-content/uploads/2014/08/79-One-of-our-favourite-books-%E2%80%9CA-Hitchhiker%E2%80%99s-Guide-to-the-Galaxy%E2%80%9D-by-Douglas-Adams.jpg", "1", "Awesomeness", "42", "Douglas Adams", "1", function(err) {
  if (err) console.log(err);
});
// posts ( id INTEGER PRIMARY KEY AUTOINCREMENT, Ptitle TEXT, Pbody TEXT, PimageUrl TEXT, timeLive INTEGER, timeSticky INTEGER, userID INTEGER, catID INTEGER, tagA TEXT, tagB TEXT, tagC TEXT, Pvote INTEGER, updated_atP REAL, created_atP REAL);
db.run("INSERT INTO posts (Ptitle, Pbody, PimageUrl, timeLive, timeSticky, userID, catID, tagA, tagB, tagC, Pvote, created_atP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", "What is Six Times Seven?", "Have you noticed that 6 * 7 is 42 woahhh that's like totally a conspiracy maannn. It's like if you search through the dictionary and take every 5th letter of every 393 word subtracting 3 and adding 5 at increments of every 4392 words you'll totally spell dude.", "http://s3.amazonaws.com/kym-assets/photos/images/original/000/141/327/sun.jpg?1309269207", "60", "8888", "1", "1", "42", "bizarre", "conspiracy", "1", function(err) {
  if (err) console.log(err);
});

// comments ( id INTEGER PRIMARY KEY AUTOINCREMENT, titleM TEXT, bodyM TEXT, userID TEXT, postID INTEGER, updated_atM REAL, created_atM REAL);
db.run("INSERT INTO comments (titleM, bodyM, userID, postID, created_atM) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)", "Your momma is 42!", "oooohhhhh, and I'm not talking about her age!", "1", "1", function(err) {
  if (err) console.log(err);
});
// users ( id INTEGER PRIMARY KEY AUTOINCREMENT, firstN TEXT, lastN TEXT, userN TEXT, email TEXT, imageUrl TEXT, image BLOB, password TEXT, Uvote INTEGER, avatar TEXT, updated_atU REAL, created_atU REAL);
db.run("INSERT INTO users (firstN, lastN, userN, email, imageUrl, image, password, Uvote, avatar, created_atU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", "George", "Smith", "Gunsmith", "cyberninjajuice@gmail.com", "http://s3.amazonaws.com/kym-assets/photos/images/original/000/141/327/sun.jpg?1309269207", "", "passWD", "1", "N", function(err) {
  if (err) console.log(err);
});