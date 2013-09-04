var Q = require('q'),
    fs = require('fs'),
    util = require('util'),
    mkdirp = require('mkdirp'),
    moment = require('moment'),
    http = require('http'),
    md = require('node-markdown').Markdown;

var env = process.env.NODE_ENV || 'development',
    config = require('../config/config')[env];

function print(format, markdown) {
    var args = Array.prototype.slice.call(arguments);
    var sliceAt = 2;
    args = args.slice(sliceAt);

    var allowedTags = 'a|b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|';
    allowedTags += 'i|img|li|ol|pre|sup|sub|strong|strike|ul|br|hr';
    
    var resultFormat = format;
    if (markdown) resultFormat = md(format, true, allowedTags);

    var formatArguments = [];
    formatArguments.push(resultFormat);
    formatArguments = formatArguments.concat(args);
    return util.format.apply(null, formatArguments);
};

function printYoutube(url, id) {
    var format = '[![%s](https://i.ytimg.com/vi/%s/0.jpg)](%s)';
    return print(format, true, url, id, url);
};

function printEmbed(string) {
    var url_regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
    var urls = string.match(url_regex) || [];
    var youtube_regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/ ]{11})(?![^\"&?\/ ])/;
    var result = string;
    for (var i = 0; i < urls.length; i++) {      
        var url = urls[i];
        var match = youtube_regex.exec(url);
        if (match !== null) {
	    result = result.replace(url, printYoutube(url, match[1]));
        }
    }
    return result;
};

function getWebUrl() {
    var domain = config.web.domain;
    var port = config.web.port;
    if (port === 80) {
	return util.format('http://%s', domain);
    } else if (port === 443) {
	return util.format('https://%s', domain);
    } else {
	return util.format('http://%s:%d', domain, port);
    }
};

function createStaticPage(timestamp, channel, destination) {
    var deferred = Q.defer();
    var url = util.format('%s/query?c=%s&o=%s&force', getWebUrl(), channel, timestamp.format('YYYY-MM-DD'));
    http.get(url, function(res) {
	var data = '';
	res.on('data', function(chunk) {
	    data += chunk.toString();
	});

	res.on('end', function() {
	    var destinationDir = util.format('%s/%s/%s/%s', destination, channel, timestamp.format('YYYY'), timestamp.format('MM'));
	    mkdirp.sync(destinationDir);
	    var destinationFile = util.format('%s/%s.html', destinationDir, timestamp.format('DD'));
	    fs.writeFileSync(destinationFile, data);
	    deferred.resolve(true);
	});
    }).on('error', function(err) {
	deferred.reject(err);
	console.log('createStaticPage error: ', err.message);
    });
    return deferred.promise;
};

module.exports.print = print;
module.exports.printEmbed = printEmbed;
module.exports.getWebUrl = getWebUrl;
module.exports.createStaticPage = createStaticPage;
