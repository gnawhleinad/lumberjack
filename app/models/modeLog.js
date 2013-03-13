var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var ModeLogSchema = log.LogSchema.extend({
    mode: String,
    target: { type: String, default: '' }
});

function irssi(modeLog, markdown) {
    markdown = markdown || false;

    if (modeLog.target) {
	var print = '-!- mode/%s [%s %s] by %s';
	if (markdown) print = '-!- mode/%s [%s %s] by **%s**';

	return util.format(print, modeLog.channel, modeLog.mode, modeLog.target, modeLog.nick);
    } else {
	var print = '-!- mode/%s [%s] by %s';
	if (markdown) print = '-!- mode/%s [%s] by **%s**';

	return util.format(print, modeLog.channel, modeLog.mode, modeLog.nick);
    }
};

ModeLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

ModeLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true));
});

mongoose.model('ModeLog', ModeLogSchema);
