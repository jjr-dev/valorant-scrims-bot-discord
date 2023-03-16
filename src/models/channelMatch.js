const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    match_id: {
        type: String,
        required: true
    },
    channel_id: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('ChannelMatch', Schema);