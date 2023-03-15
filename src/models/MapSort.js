const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    uuid: {
        type: String,
        required: true
    }
})

Schema.set('timestamps', true);

module.exports = mongoose.model('MapSort', Schema);