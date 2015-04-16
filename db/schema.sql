DROP TABLE IF EXISTS cats; CREATE TABLE cats ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, imageUrl TEXT, userID INTEGER, tagA TEXT, tagB TEXT, tagC TEXT, vote INTEGER, updated_at REAL, created_at CURRE);
CREATE TRIGGER c_time_update BEFORE UPDATE ON cats BEGIN UPDATE cats SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id; END;

DROP TABLE IF EXISTS posts; CREATE TABLE posts ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, imageUrl TEXT, timeLive INTEGER, timeSticky INTEGER, userID INTEGER, tagA TEXT, tagB TEXT, tagC TEXT, vote INTEGER, updated_at REAL, created_at REAL);
CREATE TRIGGER timestamp_update BEFORE UPDATE ON posts BEGIN UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id; END;

DROP TABLE IF EXISTS comments; CREATE TABLE comments ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, userID TEXT, postID INTEGER, updated_at REAL, created_at REAL);
CREATE TRIGGER c_timestamp_update BEFORE UPDATE ON comments BEGIN UPDATE comments SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id; END;

DROP TABLE IF EXISTS users; CREATE TABLE users ( id INTEGER PRIMARY KEY AUTOINCREMENT, firstN TEXT, lastN TEXT, userN TEXT,email TEXT, imageUrl TEXT, image BLOB, password TEXT, vote INTEGER, avatar TEXT, updated_at REAL, created_at REAL);
CREATE TRIGGER timeUpdateU BEFORE UPDATE ON posts BEGIN UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id; END;

DROP TABLE IF EXISTS subs; CREATE TABLE subs (id INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, postID INTEGER, created_at REAL);
DROP TABLE IF EXISTS csubs; CREATE TABLE csubs (id INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, catID INTEGER, created_at REAL);