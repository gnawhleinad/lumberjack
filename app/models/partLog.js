var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var PartLogSchema = log.LogSchema.extend({
    reason: String
});

function irssi(partLog, markdown) {
    markdown = markdown || false;

    var print = '-!- %s [%s@%s] has left %s [%s]';
    if (markdown) print = '-!- **%s** [%s@%s] has left **%s** [%s]';

    return util.format(print, partLog.nick, partLog.user, partLog.host, partLog.channel, partLog.reason);
};

PartLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

PartLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true));
});

mongoose.model('PartLog', PartLogSchema);
