const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

async function teste(client, msg) {
    const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Mensagem com botões')
        .setDescription("Clique em algum botão")

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('sort-match-map')
                .setLabel('Sortear mapa')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🗺️")
        );

    const m = await msg.channel.send({
        embeds: [embed],
        components: [row]
    });

    await m.react("🟢")
}

module.exports = teste;