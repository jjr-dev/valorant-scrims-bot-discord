const { EmbedBuilder, userMention } = require('discord.js');

const PlayerModel = require('../models/Player');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');

async function matches(client, msg, args) {
    const [ user ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Buscando partidas')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.channel.send({
        embeds: [embed1]
    });

    const user_id = user ? user.slice(0, -1).slice(2) : msg.author.id;

    const player = await PlayerModel.findOne({
        user_id
    });

    const wrString = player ? `${(player.win_rate * 100).toFixed(2)}%` : "Indefinido";

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Lista de partidas')
        .setDescription(`O membro ${msg.author} buscou as partidas ${user ? `${userMention(user_id)} ${EmbedWhiteSpace()}` : "dele mesmo"}`)
        .addFields([
            {
                name: "Partidas",
                value: player ? `${player.matches}` : "Indefinido",
                inline: true
            },
            {
                name: "Vitórias",
                value: player ? `${player.matches_won}` : "Indefinido",
                inline: true
            },
            {
                name: "Taxa de vitória",
                value: wrString,
                inline: true
            }
        ])

    m.edit({
        embeds: [embed2]
    });
}

module.exports = matches;