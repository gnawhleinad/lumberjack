var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    env = process.env.NODE_ENV || 'development',   
    config = require('../../config/config')[env],
    util = require('util');

var NamesLogSchema = log.LogSchema.extend({
    nicks: [String]
});

NamesLogSchema.virtual('irssi').get(function() {
    var usersChannel = util.format('[Users %s]', this.channel);

    var users = '';
    var numOps = 0;
    var numHalfops = 0;
    var numVoices = 0;
    var numNormal = 0;
    var numTotal = 0;
    this.nicks.forEach(function(nick) {
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

    var count = util.format('-!- %s: %s: Total of %d nicks [%d ops, %d halfops, %d voices, %d normal]', config.irc.nick, this.channel, numTotal, numOps, numHalfops, numVoices, numNormal);
    
    return util.format('%s\n%s\n%s', usersChannel, users, count);
});

mongoose.model('NamesLog', NamesLogSchema);
