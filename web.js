var express = require('express'),
    mongoose = require('mongoose'),
    fs = require('fs');

var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env];

process.on('uncaughtException', function(err) {
    console.log('Uncaught exception: ', err);
});

var db = mongoose.connect(config.db);

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath+'/'+file);
});

var app = express();

require('./config/express')(app, config);

require('./config/routes')(app);

var port = process.env.PORT || config.web.port;
app.listen(port);
