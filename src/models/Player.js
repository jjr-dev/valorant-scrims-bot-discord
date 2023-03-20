const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    matches: {
        type: Number,
        required: true,
        default: 0
    },
    matches_won: {
        type: Number,
        required: true,
        default: 0
    },
    win_rate: {
        type: Number,
        required: true,
        default: 0.5
    },
    link_id: {
        type: String
    },
    link_region: {
        type: String
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('Player', Schema);