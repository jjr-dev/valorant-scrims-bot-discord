const VAPI = require('../helpers/ValorantAPI');

const PlayerModel = require('../models/Player');

async function teste(client, msg, args) {
    const player = await PlayerModel.findOne({
        user_id: msg.author.id
    })

    if(player.link_id) {
        const obj = await VAPI.getMatches({
            puuid: player.link_id,
            region: player.link_region ? player.link_region : 'br',
            filters: {
                type: 'custom',
                size: 1
            }
        })

        if(obj.errors) {
            return;
        }

        const matches = obj.data;
        console.log(matches[0]);
    }
}

module.exports = teste;