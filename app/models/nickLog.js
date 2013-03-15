var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var NickLogSchema = log.LogSchema.extend({
    newNick: String
});

function irssi(nickLog, markdown) {
    markdown = markdown || false;

    var format = '-!- %s is now known as %s';
    if (markdown) format = '-!- %s is now known as **%s**';

    return chainsaw.print(format, markdown, nickLog.nick, nickLog.newNick);
};

NickLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

NickLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('NickLog', NickLogSchema);
