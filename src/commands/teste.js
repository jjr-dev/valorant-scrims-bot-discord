const { ChannelType } = require('discord.js');

async function teste(client, msg) {
    const guild = msg.guild;

    const category = await guild.channels.create({
        name: "Categoria",
        type: ChannelType.GuildCategory
    });

    const ca = await guild.channels.create({
        name: "Canal A",
        type: ChannelType.GuildVoice,
        parent: category.id
    });

    const cb = await guild.channels.create({
        name: "Canal B",
        type: ChannelType.GuildVoice,
        parent: category.id
    });
}

module.exports = teste;