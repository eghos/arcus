var express = require('express');
//var search = require('./views/search.html');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
var path = require('path');
var mysql = require('mysql');
var connection  = require('express-myconnection');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));


//create mysql Connection
  var connection = mysql.createConnection({
  	host: 'localhost',
  	user: 'node1',
  	password: 'node',
  	database: 'node_project'
    })

  //Establish MySQL connection
  connection.connect(function(err) {
     if (err)
        throw err
     else {
         console.log('Connected to MySQL');
         // Start the app when connection is ready
         app.listen(3001);
         console.log('Server listening on port 3001');
   }
  });


//app.set('view engine', 'pug');
//app.set('views', './views');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+ '/Arcus.html'));
});

app.get('/form', function(req, res) {
  res.sendFile(path.join(__dirname+ '/ArcusForm.html'));
});

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

app.post('/postaction', function(req, res) {
  res.send('Thanks for submitting data about your ' + req.body.family + ' project.');

var formData = [[req.body.family,req.body.product,req.body.experience,req.body.client,req.body.contact]];

console.log(formData);

  //});
connection.query('CREATE TABLE IF NOT EXISTS arcus (family varchar(250) DEFAULT NULL, product varchar(320) DEFAULT NULL, experience varchar(65532) DEFAULT NULL,client varchar(320) DEFAULT NULL,contact varchar(320) DEFAULT NULL );')
connection.query('INSERT INTO arcus (family, product, experience, client, contact) VALUES ?', [formData]) , function(req,res,err) {
  if(err) {
    res.send('Error');
    }
 else {
    res.send('Success');
  }
};

app.get('/', function(req, res) {
 res.sendFile(path.join(__dirname+ '/Arcus.html'));
});

});

//app.get('/search.html', function(req, res) {
//  res.sendFile(path.join(__dirname+ '/search.html'));
  //res.send('You sent the name "' + req.query + '".');
  app.get('/search', function (req, res) {
    //res.render('search')
//var searchData = [[req.query]];
console.log(req.query.search);

    connection.query("SELECT * FROM arcus WHERE family  like '%" + req.query.search + "%'", function(err, rows, fields) {
         res.render('search',{data:rows});

     });


});
