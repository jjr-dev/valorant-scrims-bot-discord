const { EmbedBuilder, userMention } = require('discord.js');

const PlayerModel = require('../models/Player');
const BlockedPlayerModel = require('../models/BlockedPlayer');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');

async function block(client, msg, args) {
    const [ user_id ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Bloqueando o jogador')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.channel.send({
        embeds: [embed1]
    });

    if(!user_id || isNaN(user_id)) {
        DeleteMessage(m);
        return;
    }

    const limit = 3;
    const player = await PlayerModel.findOne({
        user_id
    });

    const blockeds = await BlockedPlayerModel.find({
        user_id: msg.author.id
    });

    let blocked = false;
    blockeds.forEach((player) => {
        if(player.blocked_id === user_id)
            blocked = true;
    })

    if(blocked || blockeds.length >= limit || !player || user_id === msg.author.id) {
        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Jogador não bloqueado')
            .setDescription(`A tentativa de bloqueio falhou por um dos seguintes motivos:`)
            .addFields([
                {
                    name: "Limite atingido",
                    value: `É possível bloquear apenas ${limit} jogadores`
                },
                {
                    name: "Jogador não encontrado",
                    value: "O jogador informado não foi encontrado ou não é mais um membro"
                },
                {
                    name: "Jogador já bloqueado",
                    value: "O jogador informado já está em sua lista de jogadores bloqueados"
                },
                {
                    name: "Tentou se bloquear",
                    value: "O jogador informado possui o mesmo ID que o seu"
                }
            ])

        await m.edit({
            embeds: [embed2]
        });

        DeleteMessage(msg);
        return;
    }

    await BlockedPlayerModel.create({
        user_id: msg.author.id,
        blocked_id: user_id
    });

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Jogador bloqueado')
        .setDescription(`O membro ${msg.author} bloqueou o membro ${userMention(user_id)} ${EmbedWhiteSpace()}`)
        .setFooter({
            text: `⚠️ O bloqueio reduz drasticamente as chances de jogos entre os jogadores bloqueados mas não impede que aconteça caso seja necessário`
        })

    await m.edit({
        embeds: [embed2]
    });

    DeleteMessage(msg);
}

module.exports = block;