var Q = require('q'),
    async = require('async'),
    mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
    moment = require('moment'),
    chainsaw = require('../../lib/chainsaw'),
    util = require('util');

var LogSchema = new Schema({
    timestamp: { type: Date, default: Date.now, required: true },
    channel: { type: String, default: 'all', required: true },
    nick: { type: String, default: '' },
    access: { type: String, enum: ['@', '%', '+', ''], default: '' },
    user: { type: String, default: '' },
    host: { type: String, default: '' }
}, 
{ 
    collection: 'logs', 
    discriminatorKey: '_type' 
});

LogSchema.virtual('timestamp_markdown').get(function() {
    return chainsaw.print('*%s*', true, moment(this.timestamp).format('HH:mm'));
});

LogSchema.virtual('timestamp_unix').get(function() {
    return moment(this.timestamp).format('X.SSS');
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
    getLogsFrom: function(channel, from, to, strict, callback) {
		if (strict) {
		    to.seconds(to.seconds()+1);
		}

		this.find()
		    .where('channel').in(['all', channel])
		    .where('timestamp').lte(to).gte(from)
		    .sort({'timestamp': 'ascending'})
		    .exec(function(err, logs) {
				if (err) return;
				if (!logs) return;

				if (strict) {
				    var unixOffset;

				    unixOffset = moment(logs[0].timestamp);
				    var fromUnixOffset = from.valueOf();
				    while (unixOffset != fromUnixOffset) {
						logs.shift();
						if (!logs.length) break;
							unixOffset = moment(logs[0].timestamp).valueOf();
				    }

				    unixOffset = moment(logs[logs.length-1].timestamp);
				    to.seconds(to.seconds()-1);
				    var toUnixOffset = to.valueOf();
				    while (unixOffset != toUnixOffset) {
						logs.pop();
						if (!logs.length) break;
						unixOffset = moment(logs[logs.length-1].timestamp).valueOf();
				    }
				}
			
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
