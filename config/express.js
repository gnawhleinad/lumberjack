var express = require('express');

module.exports = function(app, config) {
    app.set('showStackError', true);
    app.use(express.logger('dev'));
    
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