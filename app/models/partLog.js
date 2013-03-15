var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var PartLogSchema = log.LogSchema.extend({
    reason: String
});

function irssi(partLog, markdown) {
    markdown = markdown || false;

    var format = '-!- %s [%s@%s] has left %s [%s]';
    if (markdown) format = '-!- **%s** [%s@%s] has left **%s** [%s]';

    return chainsaw.print(format, markdown, partLog.nick, partLog.user, partLog.host, partLog.channel, partLog.reason);
};

PartLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

PartLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('PartLog', PartLogSchema);
