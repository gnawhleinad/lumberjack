var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var NickLogSchema = log.LogSchema.extend({
    newNick: String
});

function irssi(nickLog, markdown) {
    markdown = markdown || false;

    var print = '-!- %s is now known as %s';
    if (markdown) print = '-!- %s is now known as **%s**';

    return util.format(print, nickLog.nick, nickLog.newNick);
};

NickLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

NickLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true), true, 'strong|em');
});

mongoose.model('NickLog', NickLogSchema);
