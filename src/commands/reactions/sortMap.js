const { EmbedBuilder, userMention } = require('discord.js');

const MatchModel = require('../../models/Match');
const MapSortMatchModel = require('../../models/MapSortMatch');

const SortMap = require('../../helpers/SortMap');

async function sortMap(client, reaction, user, add) {
    if(!add)
        return;

    const channel = client.channels.cache.get(reaction.message.channelId);

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

    const match = await MatchModel.findOne({
        message_id: reaction.message.id
    })

    if(!match || match.creator_id != user.id) {
        m.delete();
        return;
    }

    const sorts = await MapSortMatchModel.find({
        match_id: match._id,
    })

    sorts.map(async (sort) => {
        channel.messages.fetch(sort.message_id)
            .then((message) => {
                message.delete();
            })
            .catch((err) => {
                if (err.status !== 404)
                    console.log(err);
            })
    })

    await MapSortMatchModel.deleteMany({
        match_id: match._id
    })

    try {
        const map = await SortMap();

        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Mapa sorteado')
            .setDescription(`O membro ${userMention(user.id)} sorteou o mapa **${map.displayName}**`)
            .setThumbnail(map.displayIcon)
            .setImage(map.splash)

        await m.edit({
            embeds: [embed2]
        });

        await MapSortMatchModel.create({
            match_id: match._id,
            message_id: m.id,
            name: map.displayName
        })
    } catch(err) {
        m.delete();
    }
}

module.exports = sortMap;