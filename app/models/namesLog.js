var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    env = process.env.NODE_ENV || 'development',   
    config = require('../../config/config')[env],
    util = require('util'),
    md = require('node-markdown').Markdown;

var NamesLogSchema = log.LogSchema.extend({
    nicks: [String]
});

function irssi(namesLog, markdown) {
    markdown = markdown || false;

    var usersChannelPrint = '[Users %s]';
    if (markdown) usersChannel = '[Users **%s**]';
    var usersChannel = util.format(usersChannelPrint, namesLog.channel);

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

    var countPrint = '-!- %s: %s: Total of %d nicks [%d ops, %d halfops, %d voices, %d normal]';
    if (markdown) countPrint = '-!- **%s**: **%s**: Total of **%d** nicks [**%d** ops, **%d** halfops, **%d** voices, **%d** normal]';
    var count = util.format(countPrint, config.irc.nick, namesLog.channel, numTotal, numOps, numHalfops, numVoices, numNormal);
    
    return util.format('%s\n%s\n%s', usersChannel, users, count);
};

NamesLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

NamesLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true));
});

mongoose.model('NamesLog', NamesLogSchema);
