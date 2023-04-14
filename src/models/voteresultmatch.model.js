const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    match_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    attacker: {
        type: Boolean,
        required: true
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('VoteResultMatch', Schema);