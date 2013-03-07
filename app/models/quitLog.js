var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var QuitLogSchema = log.LogSchema.extend({
    reason: String
});

QuitLogSchema.virtual('irssi').get(function() {
    return util.format('-!- %s [%s@%s] has quit [%s]', this.nick, this.user, this.host, this.reason);
});

mongoose.model('QuitLog', QuitLogSchema);
