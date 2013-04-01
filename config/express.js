var express = require('express'),
    lessMiddleware = require('less-middleware');

module.exports = function(app, config) {
    app.set('showStackError', true);
    app.use(express.logger('dev'));

    app.use(express.compress({
	filter: function(req, res) {
	    return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
	},
	level: 9
    }));

    app.use(lessMiddleware({ 
	src: config.root + '/public',
	compress: true
    }));
    app.use(express.static(config.root + '/public'));

    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    app.configure(function() {
	app.use(app.router);

	app.use(function(err, req, res, next) {
	    console.error(err.stack);
	    res.status(500).render('500', {error: err.stack});
	});

	app.use(function(req, res, next) {
	    res.status(404).render('404', {url: req.originalUrl});
	});
    });
};
