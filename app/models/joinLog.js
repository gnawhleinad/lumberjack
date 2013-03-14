var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var JoinLogSchema = log.LogSchema.extend({});

function irssi(joinLog, markdown) {
    markdown = markdown || false;

    var print = '-!- %s [%s@%s] has joined %s';
    if (markdown) print = '-!- **%s** [%s@%s] has joined **%s**';
    
    return util.format(print, joinLog.nick, joinLog.user, joinLog.host, joinLog.channel);
};

JoinLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

JoinLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true), true, 'strong|em');
});

mongoose.model('JoinLog', JoinLogSchema);
