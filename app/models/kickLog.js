var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var KickLogSchema = log.LogSchema.extend({
    by: String,
    reason: String
});

KickLogSchema.virtual('irssi').get(function() {
    return util.format('-!- %s was kicked from %s by %s [%s]', this.nick, this.channel, this.by, this.reason);
});

mongoose.model('KickLog', KickLogSchema);
