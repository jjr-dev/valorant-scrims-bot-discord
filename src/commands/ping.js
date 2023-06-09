const { EmbedBuilder } = require('discord.js');

const DeleteMessage = require('../helpers/DeleteMessage');

async function ping(client, msg) {
    const m = await msg.reply("Ping?");

    const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('🏓 Pong!')
        .setDescription(`Olá ${msg.author}, seu ping está em \`${client.ws.ping}ms\`.`)

    DeleteMessage(m);
    
    msg.reply({
        embeds: [embed]
    });
}

module.exports = ping;