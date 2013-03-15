var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var KillLogSchema = log.LogSchema.extend({
    reason: String
});

function irssi(killLog, markdown) {
    markdown = markdown || false;

    var format = '-!- %s has been killed [%s]';
    if (markdown) format = '-!- %s has been killed [%s]';

    return chainsaw.print(format, markdown, killLog.nick, killLog.reason);
};

KillLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

KillLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('KillLog', KillLogSchema);
