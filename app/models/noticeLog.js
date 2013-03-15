var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    chainsaw = require('../../lib/chainsaw');

var NoticeLogSchema = log.LogSchema.extend({
    notice: String
});

function irssi(noticeLog, markdown) {
    markdown = markdown || false;

    var format = '-%s:%s- %s';
    if (markdown) format = '-%s:%s- %s';

    return chainsaw.print(format, markdown, noticeLog.nick, noticeLog.channel, noticeLog.notice);
};

NoticeLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

NoticeLogSchema.virtual('irssi_markdown').get(function() {
    return irssi(this, true);
});

mongoose.model('NoticeLog', NoticeLogSchema);
