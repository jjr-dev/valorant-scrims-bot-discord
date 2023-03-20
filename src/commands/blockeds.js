const { EmbedBuilder, userMention } = require('discord.js');

const BlockedPlayerModel = require('../models/BlockedPlayer');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');

async function blockeds(client, msg, args) {
    let [ page, configs ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Listando jogadores bloqueados')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    const limit = 10;
    if(!page) page = 1;
    
    if(isNaN(page)) {
        DeleteMessage(m);
        return;
    }

    const skip = limit * (page - 1);

    const blockeds = await BlockedPlayerModel.find({
        user_id: msg.author.id
    }).limit(limit).skip(skip);
    
    const list = [];
    blockeds.forEach((player) => {
        list.push(`${userMention(player.blocked_id)} | \`${player.blocked_id}\``)
    })

    if(blockeds.length == 0) {
        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Lista de jogadores bloqueados')
            .setDescription(`O membro ${msg.author} não possui nenhum jogador bloqueado ${EmbedWhiteSpace()}`)

        await m.edit({
            embeds: [embed2]
        })
        return;
    }

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Lista de jogadores bloqueados')
        .setDescription(`O membro ${msg.author} listou os jogadores bloqueados ${EmbedWhiteSpace()}`)
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

module.exports = blockeds;