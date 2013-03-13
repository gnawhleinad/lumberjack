var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    log = require('./log'),
    util = require('util'),
    md = require('node-markdown').Markdown;

var NoticeLogSchema = log.LogSchema.extend({
    notice: String
});

function irssi(noticeLog, markdown) {
    markdown = markdown || false;

    var print = '-%s:%s- %s';
    if (markdown) print = '-%s:%s- %s';

    return util.format(print, noticeLog.nick, noticeLog.channel, noticeLog.notice);
};

NoticeLogSchema.virtual('irssi').get(function() {
    return irssi(this);
});

NoticeLogSchema.virtual('irssi_markdown').get(function() {
    return md(irssi(this, true));
});

mongoose.model('NoticeLog', NoticeLogSchema);
