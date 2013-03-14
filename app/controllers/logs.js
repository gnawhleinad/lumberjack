var mongoose = require('mongoose'),
    Log = mongoose.model('Log'),
    util = require('util'),
    moment = require('moment');

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

    var query = {
	from: req.query.f || moment().format(sType),
	to: req.query.t || moment().format(sType)
    };

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

    Log.getLogsFrom(channel, from, to, function(logs) {
	res.render('logs/query', {
	    channel: channel,
	    from: from.utc().format(),
	    to: to.utc().format(),
	    logs: logs
	});
    });
};
