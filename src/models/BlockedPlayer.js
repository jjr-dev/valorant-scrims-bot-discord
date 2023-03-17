const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    blocked_id: {
        type: String,
        required: true
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('BlockedPlayer', Schema);