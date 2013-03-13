var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var MessageLogSchema = log.LogSchema.extend({
    message: String
});

function irssi(messageLog, markdown) {
    markdown = markdown || false;

    var print = '<%s%s> %s'
    if (markdown) print = '<%s**%s**> %s';

    return util.format(print, messageLog.access || '', messageLog.nick, messageLog.message);
};

MessageLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

MessageLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true));
});

mongoose.model('MessageLog', MessageLogSchema);
