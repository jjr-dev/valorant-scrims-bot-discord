const { EmbedBuilder, userMention } = require('discord.js');

async function sortMap(client, reaction, user, add) {
    const channel = client.channels.cache.get(reaction.message.channelId);

    if(!add)
        return;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Sorteando Mapa')
        .setDescription("`Por favor, aguarde...`")

    const m = await channel.send({
        embeds: [embed1]
    });

    const url = 'https://valorant-api.com/v1/maps';

    fetch(url)
    .then(async (res) => {
        res = await res.json();

        if(res.status !== 200)
            throw "Error status code";

        const maps = res.data;

        maps.map((map, index) => {
            if(!map.callouts)
                maps.splice(index, 1);
        })

        maps.sort();

        const random = Math.floor(Math.random() * maps.length);
        const map = maps[random];

        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Mapa sorteado')
            .setDescription(`O jogador ${userMention(user.id)} sorteou o mapa **${map.displayName}**`)
            .setThumbnail(map.displayIcon)
            .setImage(map.splash)

        await m.edit({
            embeds: [embed2]
        });
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports = sortMap;