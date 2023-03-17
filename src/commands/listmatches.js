const { EmbedBuilder, userMention } = require('discord.js');

const PlayerModel = require('../models/Player');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');

async function listmatches(client, msg, args) {
    let [ page, order ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Listando jogadores')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.channel.send({
        embeds: [embed1]
    });

    const limit = 10;

    if(!page) page = 1;
    if(!order) order = 'desc';
    
    if(isNaN(page) || (order != 'desc' && order != 'asc')) {
        DeleteMessage(m);
        return;
    }

    const skip = limit * (page - 1);

    const players = await PlayerModel.find().limit(limit).skip(skip).sort({win_rate: order});

    const list = [];
    players.forEach((player) => {
        list.push(`${userMention(player.user_id)} | Partidas: ${player.matches_won}/${player.matches} • WR: ${(player.win_rate * 100).toFixed(0)}%`)
    })

    if(players.length == 0) {
        DeleteMessage(m);
        return;
    }

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Listando jogadores')
        .setDescription(`O membro ${msg.author} listou os jogadores ${EmbedWhiteSpace()}`)
        .addFields({
            name: "Lista:",
            value: list.join("\n") + EmbedWhiteSpace()
        })
        .setFooter({
            text: `Página: ${page}\u1CBC • \u1CBCJogadores por página: ${limit}`
        })

    await m.edit({
        embeds: [embed2]
    })

    DeleteMessage(msg);
}

module.exports = listmatches;