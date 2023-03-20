const { EmbedBuilder } = require('discord.js');

const PlayerModel = require('../models/Player');

async function unlink(client, msg, args) {
    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Vinculando conta')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    const verify = await PlayerModel.findOne({
        user_id: msg.author.id
    });

    if(!verify || !verify.link_id) {
        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Conta não desvinculada')
            .setDescription(`Não existe nenhuma conta vinculada para desvincular`);

        m.edit({
            embeds: [embed2]
        });

        return
    }

    await PlayerModel.findOneAndUpdate({
        user_id: msg.author.id
    }, {
        link_id: null,
        link_region: null
    });

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Conta vinculada')
        .setDescription(`O membro ${msg.author} desvinculou sua conta do **VALORANT**`)

    m.edit({
        embeds: [embed2]
    });
}

module.exports = unlink;