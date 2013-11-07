var Q = require('q'),
    async = require('async'),
    mongoose = require('mongoose'),
    util = require('util'),
    mkdirp = require('mkdirp'),
    moment = require('moment'),
    chainsaw = require('./lib/chainsaw');

var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env];

var db = mongoose.connect(config.db);

require(__dirname + '/app/models/log');
var Log = mongoose.model('Log');

var beginning = moment('1970-01-01', 'YYYY-MM-DD').toDate();
var yesterday = moment().subtract('days', 1).endOf('day').toDate();

async.each(config.irc.options.channels, update, function (err) {
    if (err) {
    	process.exit(1);
    } else {
    	process.exit(0);
    }
});

function update(channel, updateNext) {
    var destination = util.format('%s/public/archive', config.root);
    var archive = util.format('%s/%s', destination, channel.substring(1));

    mkdirp.sync(archive);
    var timestampPromise = Log.getUniqueTimestamps(channel, beginning, yesterday, function(timestamp, timestampNext) {
    	chainsaw.createStaticPage(timestamp, channel.substring(1), destination);
    	var createPromise = chainsaw.createStaticPage(timestamp, channel.substring(1), destination);
    	createPromise.then(function() {
    	    timestampNext();
    	});
    });
    timestampPromise.then(function() {
    	updateNext();
    });
};
