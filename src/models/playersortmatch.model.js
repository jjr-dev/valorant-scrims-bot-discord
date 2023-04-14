const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    attacker: {
        type: Boolean,
        required: true
    },
    sort_id: {
        type: String,
        required: true
    },
    user_id: { 
        type: String,
        required: true
    },
    captain: {
        type: Boolean,
        required: true
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('PlayerSortMatch', Schema);