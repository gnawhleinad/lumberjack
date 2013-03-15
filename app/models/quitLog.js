var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var QuitLogSchema = log.LogSchema.extend({
    reason: String
});

function irssi(quitLog, markdown) {
    markdown = markdown || false;

    var format = '-!- %s [%s@%s] has quit [%s]';
    if (markdown) format = '-!- %s [%s@%s] has quit [%s]';

    return chainsaw.print(format, markdown, quitLog.nick, quitLog.user, quitLog.host, quitLog.reason);
};

QuitLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

QuitLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('QuitLog', QuitLogSchema);
