var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util');

var NoticeLogSchema = log.LogSchema.extend({
    notice: String
});

NoticeLogSchema.virtual('irssi').get(function() {
    return util.format('-%s:%s- %s', this.nick, this.channel, this.notice);
});

mongoose.model('NoticeLog', NoticeLogSchema);
