var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var MessageLogSchema = log.LogSchema.extend({
    message: String
});

function irssi(messageLog, markdown) {
    markdown = markdown || false;

    var format = '<%s%s> %s'
    if (markdown) format = '<%s**%s**> %s';

    return chainsaw.print(format, markdown, messageLog.access || '', messageLog.nick, messageLog.message);
};

MessageLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

MessageLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('MessageLog', MessageLogSchema);
