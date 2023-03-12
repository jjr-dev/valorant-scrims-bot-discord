const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    matches: {
        type: Number,
        required: true
    },
    matches_won: {
        type: Number,
        required: true
    },
    win_rate: {
        type: Number,
        required: true
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('Player', Schema);