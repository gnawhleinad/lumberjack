var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    env = process.env.NODE_ENV || 'development',   
    config = require('../../config/config')[env],
    util = require('util'),
    chainsaw = require('../../lib/chainsaw');

var NamesLogSchema = log.LogSchema.extend({
    nicks: [String]
});

function irssi(namesLog, markdown) {
    markdown = markdown || false;

    var usersChannelFormat = '[Users %s]';
    if (markdown) usersChannelFormat = '[Users **%s**]';
    var usersChannel = chainsaw.print(usersChannelFormat, markdown, namesLog.channel);

    var users = '';
    var numOps = 0;
    var numHalfops = 0;
    var numVoices = 0;
    var numNormal = 0;
    var numTotal = 0;
    namesLog.nicks.forEach(function(nick) {
	var access = nick.charAt(0);
	switch(access) {
	case '@':
	    numOps++;
	    users += util.format('[%s] ', nick);
	    break;
	case '%':
	    numHalfops++;
	    users += util.format('[%s] ', nick);
	    break;
	case '+':
	    numVoices++;
	    users += util.format('[%s] ', nick);
	    break;
	default:
	    numNormal++;
	    users += util.format('[ %s] ', nick);
	};
	numTotal++;
    });

    var countFormat = '-!- %s: %s: Total of %d nicks [%d ops, %d halfops, %d voices, %d normal]';
    if (markdown) countFormat = '-!- **%s**: **%s**: Total of **%d** nicks [**%d** ops, **%d** halfops, **%d** voices, **%d** normal]';
    var count = chainsaw.print(countFormat, markdown, config.irc.nick, namesLog.channel, numTotal, numOps, numHalfops, numVoices, numNormal);
    
    var resultFormat = '%s\n%s\n%s';
    if (markdown) resultFormat = '%s  \n%s  \n%s';
    return chainsaw.print(resultFormat, markdown, usersChannel, users, count);
};

NamesLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

NamesLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('NamesLog', NamesLogSchema);
