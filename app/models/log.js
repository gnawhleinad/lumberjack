var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    Schema = mongoose.Schema;

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
    }
};

mongoose.model('Log', LogSchema);

exports.LogSchema = LogSchema;
