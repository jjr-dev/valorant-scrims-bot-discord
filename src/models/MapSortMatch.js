const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    match_id: {
        type: String,
        required: true
    },
    message_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('MapSortMatch', Schema);