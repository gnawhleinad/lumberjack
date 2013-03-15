var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var ModeLogSchema = log.LogSchema.extend({
    mode: String,
    target: { type: String, default: '' }
});

function irssi(modeLog, markdown) {
    markdown = markdown || false;

    if (modeLog.target) {
	var format = '-!- mode/%s [%s %s] by %s';
	if (markdown) format = '-!- mode/%s [%s %s] by **%s**';

	return chainsaw.print(format, markdown, modeLog.channel, modeLog.mode, modeLog.target, modeLog.nick);
    } else {
	var format = '-!- mode/%s [%s] by %s';
	if (markdown) format = '-!- mode/%s [%s] by **%s**';

	return chainsaw.print(format, markdown, modeLog.channel, modeLog.mode, modeLog.nick);
    }
};

ModeLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

ModeLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('ModeLog', ModeLogSchema);
