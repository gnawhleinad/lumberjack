module.exports = function(app) {
    var logs = require('../app/controllers/logs');
    app.get('/query', logs.query);

    app.get('/', logs.index);
};
