const { EmbedBuilder } = require('discord.js');

const SortMap = require('../helpers/SortMap');
const DeleteMessage = require('../helpers/DeleteMessage');

async function sortmap(client, msg, args) {
    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Sorteando Mapa')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    try {
        const map = await SortMap();

        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Mapa sorteado')
            .setDescription(`O membro ${msg.author} sorteou o mapa **${map.displayName}**`)
            .setThumbnail(map.displayIcon)
            .setImage(map.splash)

        await m.edit({
            embeds: [embed2]
        });
    } catch(err) {
        DeleteMessage(m);
    }
}

module.exports = sortmap;