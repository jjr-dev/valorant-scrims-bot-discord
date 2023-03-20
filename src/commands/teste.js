const PlayerModel = require('../models/Player');

async function teste(client, msg, args) {
    await PlayerModel.findOneAndUpdate({
        user_id: msg.author.id
    }, {
        user_id: msg.author.id,
        matches: 28
    }, {
        upsert: true
    });

    console.log("Atualizou");
}

module.exports = teste;