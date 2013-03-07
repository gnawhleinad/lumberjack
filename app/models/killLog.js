var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var KillLogSchema = log.LogSchema.extend({
    reason: String
});

KillLogSchema.virtual('irssi').get(function() {
    return util.format('-!- %s has been killed [%s]', this.nick, this.reason);
});

mongoose.model('KillLog', KillLogSchema);
