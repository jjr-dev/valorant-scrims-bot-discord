const { EmbedBuilder } = require('discord.js');
const configs = require('../../configs.json');

async function version(client, msg) {
    const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Versão')
        .setDescription(`Olá ${msg.author}, a versão atual do BOT é \`${configs.version}\`.`)

    msg.reply({
        embeds: [embed]
    });
}

module.exports = version;