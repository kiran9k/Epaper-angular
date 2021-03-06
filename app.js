/**
 * Created by kiran on 30/10/14.
 */


var config = require(__dirname + '/config.js');
var database = require(__dirname + '/database/database.js');

var express = require('express');
var app = express();

/*
** Express Configuration
*/

// app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: config.cookieSecret}));
app.use(express.static(__dirname + '/webapp'));
app.use(express.static(config.json_path));
app.use(app.router);

/*
**Epaper Data routes(get editions, dates,path);
 */

var epaper=require(__dirname+'/epaper_data.js');
epaper.createRoutes(app,database);


/*
** User Routes (creation, login, logout)
*/

var user = require(__dirname + '/user.js');
user.createRoutes(app, database);

/*
** Feeds Routes (creation, login, logout)
*/

var articles = require(__dirname + '/articles.js');
articles.createRoutes(app, database);

/*
** Static files for web application
*/

var webapp = require(__dirname + '/webappServing.js');
webapp.createRoutes(app, database);


/*
Connecting the db
 */
database.connect(function () {
    console.log("Server started and listening on port " + config.port);
});


app.listen(config.port);
console.log("app started at : http://localhost:"+config.port);
