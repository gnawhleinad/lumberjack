var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var QuitLogSchema = log.LogSchema.extend({
    reason: String
});

function irssi(quitLog, markdown) {
    markdown = markdown || false;

    var print = '-!- %s [%s@%s] has quit [%s]';
    if (markdown) print = '-!- %s [%s@%s] has quit [%s]';

    return util.format(print, quitLog.nick, quitLog.user, quitLog.host, quitLog.reason);
};

QuitLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

QuitLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true));
});

mongoose.model('QuitLog', QuitLogSchema);
