module.exports = {
    development: {
	root: require('path').normalize(__dirname + '/..'),
	irc: {
	    server: 'localhost',
	    nick: 'lumberjack',
	    options: {
		userName: 'lumberjack',
		realName: 'lumberjack irc logger bot',
		port: 6667,
		channels: ['#rawr'],
		floodProtection: true,
		floodProtectionDelay: 1500,
		autoRejoin: true,
		autoConnect: false,
		stripColors: true,
		channelPrefixes: "#",
		messageSplit: 512
	    }
	},
	web: 'http://lumberjack',
	db: 'mongodb://localhost/lumberjack-dev'
    }
};