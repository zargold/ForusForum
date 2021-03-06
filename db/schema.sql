DROP TABLE IF EXISTS cats; CREATE TABLE cats ( id INTEGER PRIMARY KEY AUTOINCREMENT, Ctitle TEXT, Cbody TEXT, CimageUrl TEXT, userID INTEGER, tagA TEXT, tagB TEXT, tagC TEXT, Cvote INTEGER, updated_atC REAL, created_atC REAL);
CREATE TRIGGER c_time_update BEFORE UPDATE ON cats BEGIN UPDATE cats SET updated_atC = CURRENT_TIMESTAMP WHERE id = new.id; END;

DROP TABLE IF EXISTS posts; CREATE TABLE posts ( id INTEGER PRIMARY KEY AUTOINCREMENT, Ptitle TEXT, Pbody TEXT, PimageUrl TEXT, timeLive INTEGER, timeSticky INTEGER, userID INTEGER, catID INTEGER, tagA TEXT, tagB TEXT, tagC TEXT, Pvote INTEGER, updated_atP REAL, created_atP REAL);
CREATE TRIGGER timestamp_update BEFORE UPDATE ON posts BEGIN UPDATE posts SET updated_atP = CURRENT_TIMESTAMP WHERE id = new.id; END;

DROP TABLE IF EXISTS comments; CREATE TABLE comments ( id INTEGER PRIMARY KEY AUTOINCREMENT, titleM TEXT, bodyM TEXT, userID TEXT, Mvote INTEGER, postID INTEGER, updated_atM REAL, created_atM REAL);
CREATE TRIGGER c_timestamp_update BEFORE UPDATE ON comments BEGIN UPDATE comments SET updated_atM = CURRENT_TIMESTAMP WHERE id = new.id; END;

DROP TABLE IF EXISTS users; CREATE TABLE users ( id INTEGER PRIMARY KEY AUTOINCREMENT, firstN TEXT, lastN TEXT, userN TEXT, email TEXT, imageUrl TEXT, image BLOB, password TEXT, Uvote INTEGER, avatar TEXT, updated_atU REAL, created_atU REAL);
CREATE TRIGGER timeUpdateU BEFORE UPDATE ON users BEGIN UPDATE posts SET updated_atU = CURRENT_TIMESTAMP WHERE id = new.id; END;

DROP TABLE IF EXISTS subs; CREATE TABLE subs (id INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, postID INTEGER, created_at REAL);
DROP TABLE IF EXISTS csubs; CREATE TABLE csubs (id INTEGER PRIMARY KEY AUTOINCREMENT, userID INTEGER, catID INTEGER, created_at REAL);