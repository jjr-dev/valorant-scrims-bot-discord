const { userMention } = require('discord.js');

const BlockedPlayerModel = require('../models/BlockedPlayer');

async function teste2(client, msg, args) {
    const blockeds = await BlockedPlayerModel.find();

    const players = {
        blockers: {},
        blockeds: {}
    };
    blockeds.map((player) => {
        if(!players.blockeds[player.blocked_id])
            players.blockeds[player.blocked_id] = 0;

        players.blockeds[player.blocked_id] ++;

        if(!players.blockers[player.user_id])
            players.blockers[player.user_id] = 0;

        players.blockers[player.user_id] ++;
    })

    const mentions = {
        blockeds: [],
        blockers: []
    };
    for(let type in players) {
        const ps = players[type];
        for(let id in ps) {
            const blockeds = ps[id];

            mentions[type].push(`${userMention(id)} - ${type == 'blockers' ? "Bloqueou" : "Bloqueado por"} \`${blockeds}\` jogadores`);
        }
    }

    console.log(mentions);

    await msg.channel.send(`Bloqueados:\n${mentions.blockeds.join("\n")} \n\n Bloqueadores:\n${mentions.blockers.join("\n")}`);
}

module.exports = teste2;