var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    moment = require('moment');

var TopicLogSchema = log.LogSchema.extend({
    topic: String,
    setTimestamp: {type: Date, default: Date.now}
});

// TopicLogSchema.virtual('irssi.first').get(function() {
//     var topic = util.format('-!- Topic for %s: %s', this.channel, this.topic);
//     var time = moment(this.timestamp).format('ddd MMM D HH:mm:ss YYYY');
//     var setBy = util.format('-!- Topic set by %s [%s@%s] [%s]', this.nick, this.user, this.host, time);

//     return util.format('%s\n%s', topic, setBy);
// });

TopicLogSchema.virtual('irssi').get(function() {
    return util.format('-!- %s changed the topic of %s to: %s', this.nick, this.channel, this.topic);
});

mongoose.model('TopicLog', TopicLogSchema);
