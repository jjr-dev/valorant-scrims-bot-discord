const { EmbedBuilder, userMention } = require('discord.js');

const PlayerModel = require('../models/Player');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');

async function players(client, msg, args) {
    let [ page, configs ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Listando jogadores')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    let order = 'desc';
    let limit = 10;
    
    if(configs) {
        configs = configs.split(';');

        let org = {};
        configs.forEach((item) => {
            const split = item.split(':');
            
            org[split[0]] = split[1] === 'true' ? true : (split[1] === 'false' ? false : split[1]);
        })

        configs = org;

        if(configs.order)
            order = configs.order;

        if(configs.limit)
            limit = configs.limit <= 10 ? configs.limit : 10;
    }

    if(!page) page = 1;
    
    if(isNaN(page) || isNaN(limit) || (order != 'desc' && order != 'asc')) {
        DeleteMessage(m);
        return;
    }

    const skip = limit * (page - 1);

    const players = await PlayerModel.find().limit(limit).skip(skip).sort({win_rate: order});

    const list = [];
    players.forEach((player) => {
        if(configs && configs.id) 
            list.push(`${userMention(player.user_id)} | \`${player.user_id}\``)
        else
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
        .setTitle('Lista de jogadores')
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
}

module.exports = players;