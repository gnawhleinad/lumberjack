var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var MessageLogSchema = log.LogSchema.extend({
    message: String
});

MessageLogSchema.virtual('irssi').get(function() {
    return util.format('<%s> %s', this.nick, this.message);
});

mongoose.model('MessageLog', MessageLogSchema);
