var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var KickLogSchema = log.LogSchema.extend({
    by: String,
    reason: String
});

function irssi(kickLog, markdown) {
    markdown = markdown || false;

    var print = '-!- %s was kicked from %s by %s [%s]';
    if (markdown) print = '-!- %s was kicked from **%s** by **%s** [%s]';

    return util.format(print, kickLog.nick, kickLog.channel, kickLog.by, kickLog.reason);
};

KickLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

KickLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true));
});

mongoose.model('KickLog', KickLogSchema);
