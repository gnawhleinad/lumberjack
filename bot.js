var irc = require('irc'),
    mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development',   
    config = require('./config/config')[env],
    fs = require('fs'),
    util = require('util'),
    moment = require('moment');

process.on('uncaughtException', function(err) {
    console.log('Uncaught exception: ' + err);
});

mongoose.connect(config.db);

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath+'/'+file);
});
var Log = mongoose.model('Log');
var NamesLog = mongoose.model('NamesLog');
var TopicLog = mongoose.model('TopicLog');
var JoinLog = mongoose.model('JoinLog');
var PartLog = mongoose.model('PartLog');
var QuitLog = mongoose.model('QuitLog');
var KickLog = mongoose.model('KickLog');
var KillLog = mongoose.model('KillLog');
var MessageLog = mongoose.model('MessageLog');
var NoticeLog = mongoose.model('NoticeLog');
var NickLog = mongoose.model('NickLog');
var ModeLog = mongoose.model('ModeLog');

var client = new irc.Client(config.irc.server, config.irc.nick, config.irc.options);
client.connect();

client.addListener('names', function(channel, nicks) {
    var nickList = [];
    for (var nick in nicks) {
	var access = nicks[nick];
	nickList.push( access+nick );
    }
    var namesLog = new NamesLog({
	channel: channel,
	nicks: nickList
    });
    namesLog.save();
});

var first = {};
client.addListener('topic', function(channel, topic, nick, message) {
    if (!first.hasOwnProperty(channel) || !first[channel]) {
 	first[channel] = true;

 	var unixTime = parseInt(message.args[message.args.length-1]);
 	if (!isNaN(unixTime)) {
	    var setTimestamp = moment.unix(unixTime).toDate();
	    var topicLog = new TopicLog({
		setTimestamp: setTimestamp,
		channel: channel,
		topic: topic,
		nick: message.nick,
		user: message.user,
		host: message.host
	    });
	    topicLog.save();
	    return;
	}
    }

    var topicLog = new TopicLog({
	channel: channel,
	nick: message.nick,
	user: message.user,
	host: message.host,
	topic: topic
    });
    topicLog.save();
});

function sendLogs(channel, nick, lastSeen, now) {
    Log.find()
	.where('channel').in(['all', channel])
	.where('timestamp').lte(now).gt(lastSeen)
	.sort({'timestamp': 1})
	.exec(function(err, logs) {
	    if (err) return;
	    if (!logs) return;
	    logs.forEach(function(log) {
		client.say(nick, log.irssi);
	    });
	});
};

function getLastSeen(channel, nick, callback) {
    var now = new Date();
    QuitLog.find({nick: nick})
	.where('channel').equals('all')
	.where('timestamp').lte(now)
	.sort({'timestamp': -1})
	.limit(1)
	.exec(function(err, lastQuit) {
	    if (err) return;
	    if (!lastQuit) return;
	    callback(lastQuit[0].timestamp, now);
	});
};

client.addListener('join', function(channel, nick, message) {
    if (nick !== config.irc.nick) {
	getLastSeen(channel, nick, function(lastSeen, now) {
	    sendLogs(channel, nick, lastSeen, now);
	});
    }

    var joinLog = new JoinLog({
	channel: channel,
	nick: message.nick,
	user: message.user,
	host: message.host
    });
    joinLog.save();
});

client.addListener('part', function(channel, nick, reason, message) {
    var partLog = new PartLog({
	channel: channel,
	nick: message.nick,
	user: message.user,
	host: message.host,
	reason: reason || ''
    });
    partLog.save();
});

client.addListener('quit', function(nick, reason, channels, message) {
    var quitLog = new QuitLog({
	nick: message.nick,
	user: message.user,
	host: message.host,
	reason: reason || ''
    });
    quitLog.save();
});

client.addListener('kick', function(channel, nick, by, reason, message) {
    var kickLog = new KickLog({
	channel: channel,
	nick: message.nick,
	user: message.user,
	host: message.host,
	by: by,
	reason: reason || ''
    });
    kickLog.save();
});

client.addListener('kill', function(nick, reason, channels, message) {
    var killLog = new KillLog({
	nick: message.nick,
	user: message.user,
	host: message.host,
	reason: reason || ''
    });
    killLog.save();
});

client.addListener('message', function(nick, to, text, message) {
    if (to === config.irc.nick) return;
    var messageLog = new MessageLog({
	channel: to,
	nick: message.nick,
	user: message.user,
	host: message.host,
	message: text
    });
    messageLog.save();
});

client.addListener('notice', function(nick, to, text, message) {
    if (to === config.irc.nick) return;
    if (to === 'AUTH') return;

    var user = '';
    var host = '';
    if (!nick) {
	nick = config.irc.server;
    } else {
	user = message.user;
	host = message.host;
    }
    var noticeLog = new NoticeLog({
	channel: to,
	nick: nick,
	user: user,
	host: host,
	notice: text
    });
    noticeLog.save();
});

client.addListener('nick', function(oldNick, newNick, channels, message) {
    var nickLog = new NickLog({
	channel: 'all',
	nick: message.nick,
	user: message.user,
	host: message.host,
	newNick: newNick
    });
    nickLog.save();
});

function addModeLog(channel, by, mode, target, message) {
    var modeLog = new ModeLog({
	channel: channel,
	nick: message.nick,
	user: message.user,
	host: message.host,
	mode: mode,
	target: target,
    });
    modeLog.save();
};

client.addListener('-mode', function(channel, by, mode, argument, message) {
    addModeLog(channel, by, '-'+mode, argument, message);
});

client.addListener('+mode', function(channel, by, mode, argument, message) {
    addModeLog(channel, by, '+'+mode, argument, message);
});
