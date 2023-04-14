const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    match_id: {
        type: String,
        required: true
    },
    message_id: {
        type: String
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('PlayerMatch', Schema);