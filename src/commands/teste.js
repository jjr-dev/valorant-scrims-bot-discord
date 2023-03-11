const { ChannelType } = require('discord.js');

async function teste(client, msg) {
    const c = await msg.guild.channels.create({
        name: "hello",
        type: ChannelType.GuildVoice
    });

    const m = msg.guild.members.cache.get(msg.author.id);
    m.voice.setChannel(c.id);

    setTimeout(() => {
        c.delete();
    }, 10000)
}

module.exports = teste;