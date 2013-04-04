var Q = require('q'),
    async = require('async'),
    mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
    moment = require('moment'),
    chainsaw = require('../../lib/chainsaw');

var LogSchema = new Schema({
    timestamp: {type: Date, default: Date.now, required: true},
    channel: {type: String, default: 'all', required: true},
    nick: {type: String, default: ''},
    access: {type: String, enum: ['@', '%', '+', ''], default: ''},
    user: {type: String, default: ''},
    host: {type: String, default: ''}
}, 
{ 
    collection: 'logs', 
    discriminatorKey: '_type' 
});

LogSchema.virtual('timestamp_markdown').get(function() {
    return chainsaw.print('*%s*', true, moment(this.timestamp).format('HH:mm'));
});

LogSchema.statics = {
    getLastSeen: function(channel, nick, from, callback) {
	this.where('nick').equals(nick)
            .where('_type').in(['PartLog', 'QuitLog', 'KickLog', 'KillLog'])
	    .where('channel').in(['all', channel])
	    .where('timestamp').lte(from)
	    .sort({'timestamp': 'descending'})
            .select('timestamp')
	    .findOne(function(err, lastSeen) {
		if (err) return;
		if (!lastSeen) return;
		callback(lastSeen.timestamp);
	    });
    },
    getLogsFrom: function(channel, from, to, callback) {
	this.find()
	    .where('channel').in(['all', channel])
	    .where('timestamp').lte(to).gt(from)
	    .sort({'timestamp': 'ascending'})
	    .exec(function(err, logs) {
		if (err) return;
		if (!logs) return;
		callback(logs);
	    });
    },
    getUniqueTimestamps: function(channel, from, to, callback) {
	var deferred = Q.defer();
	this.find()
	    .where('channel').in(['all', channel])
	    .where('timestamp').lte(to).gte(from)
	    .sort({'timestamp': 'ascending'})
            .select('timestamp')
	    .exec(function(err, logs) {
		if (err) return;
		if (!logs) return;

		var uniques = _.uniq(logs, function(log) {
		    return moment(log.timestamp).format('YYYY-MM-DD');
		});
		uniques = _.map(uniques, function(log) {
		    return moment(log.timestamp);
		});
		async.each(uniques, callback, function(aerr) {
		    if (aerr) {
			deferred.reject(aerr);
		    } else {
			deferred.resolve(true);
		    }
		});
	    });
	return deferred.promise;
    },
    existsLogsOn: function(channel, on, callback) {
	var from = moment(on).startOf('day').toDate();
	var to = moment(on).endOf('day').toDate();
	this.find()
	    .where('channel').in(['all', channel])
	    .where('timestamp').lte(to).gte(from)
            .select('timestamp')
	    .count(function(err, count) {
		if (count >= 1) {
		    callback();
		}
	    });
    }
};

mongoose.model('Log', LogSchema);

exports.LogSchema = LogSchema;
