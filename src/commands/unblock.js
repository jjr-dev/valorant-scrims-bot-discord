const { EmbedBuilder, userMention } = require('discord.js');

const BlockedPlayerModel = require('../models/BlockedPlayer');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');

async function unblock(client, msg, args) {
    const [ user_id ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Desbloqueando o jogador')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.channel.send({
        embeds: [embed1]
    });

    if(!user_id || isNaN(user_id)) {
        DeleteMessage(m);
        return;
    }

    const blocked = await BlockedPlayerModel.findOne({
        user_id: msg.author.id,
        blocked_id: user_id
    });

    if(!blocked) {
        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Jogador não desbloqueado')
            .setDescription(`A tentativa de desbloqueio falhou por um dos seguintes motivos:`)
            .addFields([
                {
                    name: "Jogador não bloqueado",
                    value: `O jogador informado já não estava em sua lista de jogadores bloqueados`
                },
                {
                    name: "Jogador não encontrado",
                    value: "O jogador informado não foi encontrado ou não é mais um membro"
                }
            ])

        await m.edit({
            embeds: [embed2]
        });
        return;
    }

    await BlockedPlayerModel.deleteOne({
        _id: blocked.id
    });

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Jogador bloqueado')
        .setDescription(`O membro ${msg.author} desbloqueou o membro ${userMention(user_id)} ${EmbedWhiteSpace()}`)

    await m.edit({
        embeds: [embed2]
    });
}

module.exports = unblock;