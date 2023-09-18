// Create web server and listen on port 3000
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/Comments';
var db;
var collection;
var ObjectId = require('mongodb').ObjectID;

// Connect to the database
MongoClient.connect(url, function(err, database) {
	if (err) {
		console.log('Unable to connect to the Server:', err);
	} else {
		console.log('Connected to Server');
		db = database;
		collection = db.collection('comments');
	}
});

app.use(bodyParser.json());

// Create GET route for comments
app.get('/comments', function(req, res) {
	console.log('Received GET request');
	collection.find({}).toArray(function(err, result) {
		if (err) {
			console.log(err);
		} else if (result.length) {
			res.json(result);
		} else {
			res.send('No documents found');
		}
	});
});

// Create POST route for comments
app.post('/comments', function(req, res) {
	console.log('Received POST request');
	collection.insert(req.body, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.json(result.ops[0]);
		}
	});
});

// Create DELETE route for comments
app.delete('/comments/:id', function(req, res) {
	console.log('Received DELETE request');
	collection.remove({
		_id: new ObjectId(req.params.id)
	}, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.json(result);
		}
	});
});

// Create PUT route for comments
app.put('/comments/:id', function(req, res) {
	console.log('Received PUT request');
	collection.update({
		_id: new ObjectId(req.params.id)
	}, {
		$set: {
			text: req.body.text
		}
	}, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.json(result);
		}
	});
});

// Listen on port 3000
app.listen(3000, function() {
	console.log('App listening on port 3000');
});
