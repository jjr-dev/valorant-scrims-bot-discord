const { EmbedBuilder } = require('discord.js');

const MatchModel = require('../models/Match');

async function create(client, msg, args) {
    let [ type, date, hour ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Configurando SCRIM')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.channel.send({
        embeds: [embed1]
    });

    await MatchModel.create({
        message_id: m.id,
        user_id: msg.author.id
    });

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('SCRIM agendada')
        .setDescription(`O jogador ${msg.author} deseja criar uma **SCRIM**`)
        .addFields(
            {
                name: "Tipo",
                value: type ? type : 'Indefinido',
                inline: true
            },
            {
                name: "Dia",
                value: date ? date : 'Indefinido',
                inline: true
            },
            {
                name: "Horário",
                value: hour ? hour : 'Indefinido',
                inline: true
            },
            {
                name: "Como participar",
                value: "Reaja com ✅ a esta mensagem"
            },
            {
                name: "Como sortear o mapa",
                value: "Reaja com 🗺️ a esta mensagem"
            },
            {
                name: "Como sortear os jogadores",
                value: "Reaja com 🎲 a esta mensagem"
            }
        )

    await m.edit({
        embeds: [embed2]
    });

    await m.react('✅');
    await m.react('🗺️');
    await m.react('🎲');
}

module.exports = create;