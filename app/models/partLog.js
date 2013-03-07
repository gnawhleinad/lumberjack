var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var PartLogSchema = log.LogSchema.extend({
    reason: String
});

PartLogSchema.virtual('irssi').get(function() {
    return util.format('-!- %s [%s@%s] has left %s [%s]', this.nick, this.user, this.host, this.channel, this.reason);
});

mongoose.model('PartLog', PartLogSchema);
