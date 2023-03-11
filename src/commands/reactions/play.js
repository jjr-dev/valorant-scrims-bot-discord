const MatchModel = require('../../models/Match');
const PlayerSortMatchModel = require('../../models/PlayerSortMatch');
const SortMatchModel = require('../../models/SortMatch');
const ChannelMatchModel = require('../../models/ChannelMatch');

const { EmbedBuilder, ChannelType } = require('discord.js');

async function play(client, reaction, user, add) {
    const channel = client.channels.cache.get(reaction.message.channelId);
    
    if(!add)
        return;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Separando jogadores')
        .setDescription("`Por favor, aguarde...`")

    const m = await channel.send({
        embeds: [embed1]
    });

    const sort = await SortMatchModel.findOne({
        message_id: reaction.message.id
    });

    const match = await MatchModel.findOne({
        _id: sort.match_id
    });

    const players = await PlayerSortMatchModel.find({
        sort_id: sort._id
    });

    const guild = reaction.message.guild;

    const ca = await guild.channels.create({
        name: "Equipe A",
        type: ChannelType.GuildVoice
    });

    const cb = await guild.channels.create({
        name: "Equipe B",
        type: ChannelType.GuildVoice
    });

    players.map(async (player) => {
        const member = guild.members.cache.get(player.user_id);
        await member.voice.setChannel(player.attacker ? ca : cb);
    })

    const channels = [ca, cb];
    channels.forEach(async (channel) => {
        await ChannelMatchModel.create({
            match_id: match._id,
            channel_id: channel.id
        })
    })

    m.delete();
    reaction.message.delete();

    client.channels.cache.get(reaction.message.channelId).messages.fetch(match.message_id).then((msg) => {
        msg.delete();
    })
}

module.exports = play;