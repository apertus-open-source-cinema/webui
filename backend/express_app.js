var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/../dist/`));
app.use((req, res) => res.sendFile(path.resolve(`${__dirname}/../dist/index.html`)));

module.exports = app;