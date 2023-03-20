const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

const DeleteMessage = require('../helpers/DeleteMessage');

async function private(client, msg) {
    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Criando canal privado')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    const guild = msg.guild;

    const category = await guild.channels.cache.get('1086335065157533737');

    const channel_name = `pv-${msg.author.id}`;

    let channel = await client.channels.cache.find((c) => c.name === channel_name);

    if(!channel) {
        const everyone = guild.roles.cache.find((r) => r.name === '@everyone');

        await msg.guild.roles.cache.forEach(async (role) => {
            if(role.name === 'Conversa sozinho') {
                const has = await msg.member.roles.cache.has(role.id);
    
                if(has)
                    role.delete()
                        .catch((err) => {
                            if(err.status !== 404)
                                console.log(err);
                        })
            }
        })

        const role = await guild.roles.create({
            name: `Conversa sozinho`
        })

        channel = await guild.channels.create({
            name: channel_name,
            type: ChannelType.GuildText,
            parent: category.id,
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
        });

        const member = await guild.members.cache.get(msg.author.id);
        
        if(member)
            await member.roles.add(role.id);
    }

    const seconds = 5;

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Canal privado')
        .setDescription(`${msg.author}, encontre seu canal na categoria **${category.name}** | ${channel}`)
        .setFooter({
            text: `⚠️ Para sua privacidade, essa mensagem será excluída ${seconds} segundos depois de ser criada`
        })

    await m.edit({
        embeds: [embed2]
    });

    setTimeout(() => {
        DeleteMessage(m);
    }, seconds * 1000)
}

module.exports = private;