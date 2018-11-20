//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var mongoose = require('mongoose');

const jwt = require('jsonwebtoken');


//Database schemas
var Junk = require('./model/junk');


app.set('view engine', 'ejs');


//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


var db = mongoose.connect('mongodb://raj:password123@ds163683.mlab.com:63683/scambio')


var Users = [{
    username: "admin",
    password: "admin"
}]

var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]



//tesing jwt start
app.get('/api', (req, res) => {
    res.json({
        message: "Welcome to api"
    });
});


app.post('/api/posts', verifyToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message: "Post Created",
                authData
            });
        }
    });

});

app.post('/api/login', (req, res) => {

    const user = {
        id: 1,
        username: "raj",
        pswd: "password123"
    }

    jwt.sign({user}, 'secretkey', { expiresIn: '2h'}, (err, token) => {
        res.send(
            token
        );
    });

});

//tesing jwt end

app.post('/junk', function(req, res){
    var junk = new Junk(req.body);
    junk.save(function(err, savedJunk){
        if(err){
            res.status(500).send({error:"Could not save your junk"});
        }else{
            res.status(200).send(savedJunk);
        }

    });
});

app.get('/junk', function(req,res){
    Junk.find({}, function(err, junks){
        if(err){
            res.status(500).send({error: "could not fetch junks"});
        }else{
            res.send(junks);
        }
    });
});


//Route to handle Post Request Call
app.post('/login', function (req, res) {


    console.log("Inside Login Post Request");
    console.log("Req Body : ", req.body);
    Users.filter(function (user) {
        if (user.username === req.body.username && user.password === req.body.password) {
            res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
            req.session.user = user;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end("Successful Login");
        }
    })


});

//Route to get All Books when user visits the Home Page
app.get('/home', function (req, res) {
    console.log("Inside Home Login");
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    console.log("Books : ", JSON.stringify(books));
    res.end(JSON.stringify(books));

})

//Route to create book
app.post('/create', function (req, res) {
    var newBook = { BookID: req.body.params.BookID, Title: req.body.params.Title, Author: req.body.params.Author };
    books.push(newBook);
    console.log('newBook ' + newBook)
    console.log("Book Added Successfully!!!!");
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })
    res.end('/home')


});

//Route to Delete

app.delete('/delete/:BookID', function (req, res) {
    console.log("Inside Delete Request");
    var index = books.map(function (book) {
        return book.BookID;
    }).indexOf(req.params.BookID);
    console.log("req.params.BookID " + req.params.BookID)
    console.log("index " + index)

    if (index === -1) {
        console.log("Book Not Found");
    } else {
        books.splice(index, 1);
        console.log("Book : " + req.params.BookID + " was removed successfully");
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.end('/home')
    }
})


//Verify verifyToken

function verifyToken(req, res, next){
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        //Forbidden
        res.sendStatus(403);
    }
}
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
