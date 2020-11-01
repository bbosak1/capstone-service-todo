// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/family");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var Todo = mongoose.model('Todo', {
    descr: String,
    assignee: String,
});

// Get all todos
app.get('/api/todos', function (req, res) {

    console.log("Listing Todos...");

    //use mongoose to get all Todos in the database
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(todos); // return all Todos in JSON format
    });
});

// Create a todo item
app.post('/api/todos', function (req, res) {

    console.log("Creating Todo...");

    Todo.create({
        descr: req.body.descr,
        assignee: req.body.assignee,
    }, function (err, todo) {
        if (err) {
            res.send(err);
        }

        // create and return todos
        Todo.find(function (err, todos) {
            if (err)
                res.send(err);
            res.json(todos);
        });
    });

});


// Start app and listen on port 8082
app.listen(process.env.PORT || 8082);
console.log("Todos server listening on port  - ", (process.env.PORT || 8082));