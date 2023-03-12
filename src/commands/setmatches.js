const { EmbedBuilder, userMention } = require('discord.js');

const PlayerModel = require('../models/Player');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');

async function setmatches(client, msg, args) {
    const [ user, matches, matches_won ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Armazenando partidas')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.channel.send({
        embeds: [embed1]
    });

    if(!msg.member.roles.cache.has("1084548547212484838")) {
        m.delete();
        return;
    }

    if(!user || !user.includes("<@") || !user.includes(">") || !matches || isNaN(matches) || !matches_won || isNaN(matches_won)) {
        m.delete();
        return;
    }

    const user_id  = user.slice(0, -1).slice(2);
    const win_rate = (matches_won / matches).toFixed(2);

    await PlayerModel.deleteOne({
        user_id
    })

    await PlayerModel.create({
        user_id,
        win_rate,
        matches,
        matches_won
    })

    const wrString = `${(win_rate * 100).toFixed(2)}%`;

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Partidas armazenadas')
        .setDescription(`O membro ${msg.author} definiu as partidas do jogador ${userMention(user_id)} ${EmbedWhiteSpace()}`)
        .addFields([
            {
                name: "Partidas",
                value: matches,
                inline: true
            },
            {
                name: "Vitórias",
                value: matches_won,
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

    msg.delete();
}

module.exports = setmatches;