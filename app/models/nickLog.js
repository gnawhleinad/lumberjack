var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var NickLogSchema = log.LogSchema.extend({
    newNick: String
});

NickLogSchema.virtual('irssi').get(function() {
    return util.format('-!- %s is now known as %s', this.nick, this.newNick);
});

mongoose.model('NickLog', NickLogSchema);
