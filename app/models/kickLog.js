var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var KickLogSchema = log.LogSchema.extend({
    by: String,
    reason: String
});

function irssi(kickLog, markdown) {
    markdown = markdown || false;

    var format = '-!- %s was kicked from %s by %s [%s]';
    if (markdown) format = '-!- %s was kicked from **%s** by **%s** [%s]';

    return chainsaw.print(format, markdown, kickLog.nick, kickLog.channel, kickLog.by, kickLog.reason);
};

KickLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

KickLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('KickLog', KickLogSchema);
