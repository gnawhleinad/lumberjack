var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var JoinLogSchema = log.LogSchema.extend({});

JoinLogSchema.virtual('irssi').get(function() {
    return util.format('-!- %s [%s@%s] has joined %s', this.nick, this.user, this.host, this.channel);
});

mongoose.model('JoinLog', JoinLogSchema);
