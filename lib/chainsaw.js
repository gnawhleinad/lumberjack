var util = require('util'),
    md = require('node-markdown').Markdown;

module.exports = {
    print: function(format, markdown) {
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
    }
};
