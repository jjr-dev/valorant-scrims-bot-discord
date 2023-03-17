const { ChannelType, PermissionsBitField } = require('discord.js');

async function teste(client, msg) {
    const guild = msg.guild;

    const everyone = guild.roles.cache.find((r) => r.name === '@everyone');

    const role = await guild.roles.create({
        name: `TESTANDO`
    })

    const category = await guild.channels.create({
        name: "Categoria",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                id: everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: role.id,
                allow: [PermissionsBitField.Flags.ViewChannel]
            }
        ]
    })

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