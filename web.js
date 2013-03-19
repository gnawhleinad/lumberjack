var express = require('express'),
    mongoose = require('mongoose'),
    cronJob = require('cron').CronJob,
    fs = require('fs'),
    util = require('util'),
    mkdirp = require('mkdirp'),
    moment = require('moment'),
    chainsaw = require('./lib/chainsaw');

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

var channels = config.irc.options.channels;
channels.forEach(function(channel) {
    var archive = util.format('%s/public/archive/%s', config.root, channel.substring(1));
    mkdirp.sync(archive);
});

var port = process.env.PORT || config.web.port;
app.listen(port);

var job = new cronJob({
    cronTime: '42 00 00 * * *',
    onTick: function() {
	var yesterday = moment().subtract('days', 1);
	channels.forEach(function(channel) {
	    var destination = util.format('%s/public/archive', config.root);
	    chainsaw.createStaticPage(yesterday, channel.substring(1), destination);
	});
    },
    start: true
});
