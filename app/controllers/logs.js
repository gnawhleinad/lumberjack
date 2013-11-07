var mongoose = require('mongoose'),
    Log = mongoose.model('Log'),
    fs = require('fs'),
    util = require('util'),
    moment = require('moment');

var env = process.env.NODE_ENV || 'development',
    config = require('../../config/config')[env];

exports.query = function(req, res) {
    if (req.query.c == null) {
		return res.send(400, 'No c (channel) parameter');
    }

    var channel = '#' + req.query.c;

    var sType = 'YYYY-MM-DD';
    var uType = 'X';

    var sRegex = /\d{4}-\d{2}-\d{2}/;
    var uRegex = /\d+/;

    var ready = {
		from: null,
		to: null
    };

    var force = false;
    var strict = false;

    var query = {};
    if (req.query.o) {
		force = req.query.hasOwnProperty('force');

		var date = moment(req.query.o).startOf('day');
		query = {
		    from: date.format('YYYY-MM-DD'),
		    to: date.endOf('day').unix()
		};
    } else {
		strict = req.query.hasOwnProperty('strict');
		if (strict) {
		    uType = 'X.SSS';
		    uRegex = /\d+\.\d{3}/;
		}

		query = {
		    from: req.query.f || moment().format(sType),
		    to: req.query.t || moment().format(sType)
		};
    }

    for (var ft in query) {
		if (sRegex.exec(query[ft])) {
		    ready[ft] = moment(query[ft], sType);
		} else if (uRegex.exec(query[ft])) {
		    ready[ft] = moment.unix(query[ft]);
		} else {
		    return res.send(400, util.format('Invalid %s (%s) parameter', ft.charAt(0), ft));
		}
    }

    var from = ready.from;
    var to = ready.to;

    if (from.isAfter(to)) {
		return res.send(400, util.format('f (from) "%s" is after t (to) "%s"', from.format(sType)), to.format(sType));
    } 

    if (req.query.o && !force) {
		var redirect = util.format('/archive/%s/%s/%s/%s.html', channel.substring(1), from.format('YYYY'), from.format('MM'), from.format('DD'));
		var archive = util.format('%s/public%s', config.root, redirect);
		if (fs.existsSync(archive)) {
		    return res.redirect(redirect);
		}
    }

    Log.getLogsFrom(channel, from, to, strict, function(logs) {
		res.render('logs/query', {
		    channel: channel,
		    from: from.utc().format(),
		    to: to.utc().format(),
		    logs: logs
		});
    });
};

exports.index = function(req, res) {
    res.render('logs/index', {
		channels: config.irc.options.channels
    });
};
