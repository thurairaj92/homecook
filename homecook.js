'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const _ = require('underscore');

var path = require('path');
var http = require('http');
var app = express();
app.use(express.static('public'));

let HOME_COOK_DB = {
	HOST : '54.179.165.116',
	PORT : '27017',
	USERNAME : 'home_cook_db_admin',
	PASSWORD : 'home_cook_db_admin',
	DATABASE : 'home_cook_dev'
}

let DB_URI_HOME_COOK_URI = "mongodb://" + HOME_COOK_DB.USERNAME + ":" + HOME_COOK_DB.PASSWORD + "@" + HOME_COOK_DB.HOST + ":" + HOME_COOK_DB.PORT + "/" + HOME_COOK_DB.DATABASE;
//let DB_URI_POSTAL_CODE_URI = "mongodb://" + POSTAL_CODE_DB.USERNAME + ":" + POSTAL_CODE_DB.PASSWORD + "@" + POSTAL_CODE_DB.HOST + ":" + POSTAL_CODE_DB.PORT + "/" + POSTAL_CODE_DB.DATABASE;

var connectToDatabase = uri => {
	return new Promise((resolve, reject) => {
		console.log(uri);
		MongoClient.connect(uri, (err, db) => {
			if(err){
				reject({"error" : "DB CONFIG"});
			}else{
				resolve(db);
			}
		})
	})
}

var findQuery = (db, collection_name, query, projection) => {
	console.log(query);
	return new Promise((resolve, reject) => {
		db.collection(collection_name).find(query, projection).toArray((err, docs) => {
			console.log(docs);
			if(err){
				reject({"error" : "DB QUERY ERROR"})
			}else if(docs.length === 0){
				reject({"error" : "NO RESULT", "message" : "NO_PLACE"});
			}else{
				resolve(docs);
			}
		})
	})
}

var findLatLonByPostalCode = postalcode => {
	let query = {
		"Postal Code" : { $regex: new RegExp('^' + postalcode + '$', "i") }
	}

	return new Promise((resolve, reject) => {
		connectToDatabase(DB_URI_HOME_COOK_URI)
		.then(db => { return findQuery(db, "postal_code", query, {}); })
		.then(result => { resolve(result)})
		.catch(err => { err.message = "NO_POSTAL_CODE"; reject(err) })
	});
}

var findCookNearBy = (lat, lon, distance) => {
	//return promise
	let query = { 
		"address.geo_location": { 
			$near : { $geometry: { type: "Point",  coordinates: [lon, lat] }, $maxDistance: distance }
		}
    }

    let projection = {
		"products.food" : 1,
		"products.category" : 1,
		"name": 1
    }
   
	return new Promise((resolve, reject) => {
		connectToDatabase(DB_URI_HOME_COOK_URI)
		.then(db => { return findQuery(db, "user_food", query, projection); })
		.then(result => { resolve(result)})
		.catch(err => { err.message = "NO_PLACE"; reject(err) })
	});
}

app.get('/getCooks', (req, res) => {
	var postal_code = req.query.postal_code;
	if(!postal_code){
		response = {"error" : "input error"};
		res.send(response);
	}else{
		findLatLonByPostalCode(postal_code)
		.then(results => {
			var postal_code = results[0];
			return findCookNearBy(postal_code.Latitude, postal_code.Longitude, 5000)
		})
		.then( results => {
			console.log(results);
			res.json(results);
		})
		.catch(err => {
			console.log(err);
			res.json(err);
		})
	}
})


app.listen(2017, () => {
	console.log('Server listening on port 2017');
})