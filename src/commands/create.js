const { EmbedBuilder } = require('discord.js');

const MatchModel = require('../models/Match');

async function create(client, msg, args) {
    let [ player_limit ] = args;

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
        creator_id: msg.author.id,
        user_id: msg.author.id,
        player_limit 
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
                value: player_limit ? `${player_limit}x${player_limit}` : 'Indefinido',
                inline: true
            },
            {
                name: "Como participar",
                value: "Reaja com ✅ a esta mensagem"
            },
            {
                name: "Como ver lista de jogadores",
                value: "Reaja com 📃 a esta mensagem"
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
        .setFooter({
            text: `⚠️ Apenas o criador da SCRIM pode sortear mapa ou jogadores`
        })

    await m.edit({
        embeds: [embed2]
    });

    await m.react('✅');
    await m.react('📃');
    await m.react('🗺️');
    await m.react('🎲');
}

module.exports = create;