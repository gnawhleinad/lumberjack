var mongoose = require('mongoose'),
    Log = mongoose.model('Log'),
    util = require('util'),
    moment = require('moment');

exports.query = function(req, res) {
    if (req.query.c == null) {
	return res.send(400, 'No c (channel) parameter');
    }

    var sType = 'YYYY-MM-DD';
    var uType = 'X';

    var channel = req.query.c;
    var query = {
	from: req.query.f || moment().format(sType),
	to: req.query.t || moment().format(sType)
    };

    for (var date in query) {
	var isSType = moment(query[date], sType).isValid();
	var isUType = moment(query[date], uType).isValid();
	if (!isSType && !isUType) {
	    return res.send(400, util.format('Invalid %s (%s) parameter', date.charAt(0), date));
	}
    }

    var from = moment(query.from);
    var to = moment(query.to);

    if (from.isAfter(to)) {
	return res.send(400, util.format('f (from) "%s" is after t (to) "%s"', from.format(sType)), to.format(sType));
    }
    
    Log.getLogsFrom(channel, from, to, function(logs) {
	res.render('logs/results', {
	    channel: '#'+channel,
	    from: from.format(sType),
	    to: to.format(sType),
	    logs: logs
	});
    });
};
