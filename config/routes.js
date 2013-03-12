var mongoose = require('mongoose'),
    Log = mongoose.model('Log'),
    moment = require('moment');

module.exports = function(app) {
    var logs = require('../app/controllers/logs');
    app.get('/query', logs.query);
};
