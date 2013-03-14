var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var KillLogSchema = log.LogSchema.extend({
    reason: String
});

function irssi(killLog, markdown) {
    markdown = markdown || false;

    var print = '-!- %s has been killed [%s]';
    if (markdown) print = '-!- %s has been killed [%s]';

    return util.format(print, killLog.nick, killLog.reason);
};

KillLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

KillLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true), true, 'strong|em');
});

mongoose.model('KillLog', KillLogSchema);
