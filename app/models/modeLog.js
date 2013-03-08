var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var ModeLogSchema = log.LogSchema.extend({
    mode: String,
    target: { type: String, default: '' }
});

ModeLogSchema.virtual('irssi').get(function() {
    if (this.target) {
	return util.format('-!- mode/%s [%s %s] by %s', this.channel, this.mode, this.target, this.nick);
    } else {
	return util.format('-!- mode/%s [%s] by %s', this.channel, this.mode, this.nick);
    }
});

mongoose.model('ModeLog', ModeLogSchema);
