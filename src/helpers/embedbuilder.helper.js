const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    return new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
}