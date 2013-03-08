var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    Schema = mongoose.Schema;

var LogSchema = new Schema({
    timestamp: {type: Date, default: Date.now, required: true},
    channel: {type: String, default: 'all', required: true},
    nick: {type: String, default: ''},
    access: {type: String, enum: ['@', '%', '+', ''], default: ''},
    user: {type: String, default: ''},
    host: {type: String, default: ''}
}, 
{ 
    collection: 'logs', 
    discriminatorKey: '_type' 
});

mongoose.model('Log', LogSchema);

exports.LogSchema = LogSchema;