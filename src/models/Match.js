const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    message_id: {
        type: String,
        required: true
    },
    player_limit: {
        type: Number
    },
    creator_id: {
        type: String,
        required: true
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('Match', Schema);