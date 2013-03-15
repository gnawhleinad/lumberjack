var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var JoinLogSchema = log.LogSchema.extend({});

function irssi(joinLog, markdown) {
    markdown = markdown || false;

    var format = '-!- %s [%s@%s] has joined %s';
    if (markdown) format = '-!- **%s** [%s@%s] has joined **%s**';
    
    return chainsaw.print(format, markdown, joinLog.nick, joinLog.user, joinLog.host, joinLog.channel);
};

JoinLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

JoinLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('JoinLog', JoinLogSchema);
