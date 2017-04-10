'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
const _ = require('underscore');

const path = require('path');
const http = require('http');
const app = express();

app.use(express.static('public'));


app.get('/', (req, res) => {
	res.sendFile('index.html')
});

app.listen(3001, () => {
	console.log('Server listening on port 3001')
})
