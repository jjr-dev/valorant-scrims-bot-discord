const { EmbedBuilder, userMention } = require('discord.js');

const MatchModel = require('../../models/Match');
const PlayerMatchModel = require('../../models/PlayerMatch');
const PlayerSortMatchModel = require('../../models/PlayerSortMatch');
const SortMatchModel = require('../../models/SortMatch');

const EmbedWhiteSpace = require('../../helpers/EmbedWhiteSpace');

async function sortPlayers(client, reaction, user, add) {
    if(!add)
        return;

    const channel = client.channels.cache.get(reaction.message.channelId);

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Sorteando jogadores')
        .setDescription("`Por favor, aguarde...`")

    const m = await channel.send({
        embeds: [embed1]
    });

    const match = await MatchModel.findOne({
        message_id: reaction.message.id
    })

    if(match.creator_id != user.id) {
        m.delete();
        return;
    }

    let players = await PlayerMatchModel.find({
        match_id: match._id
    });

    if(players.length < 2) {
        m.delete();
        return;
    }

    for(let i = 0; i < players.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }

    const teams = {
        attacker: [],
        defender: []
    }

    await SortMatchModel.create({
        match_id: match._id,
        message_id: m.id
    });

    const sort = await SortMatchModel.findOne().sort({_id: -1});

    players.map((player, index) => {
        const attacker = index % 2 === 0;
        teams[attacker ? 'attacker' : 'defender'].push({
            user_id: player.user_id,
            sort_id: sort._id,
            attacker
        });
    })
    
    if(!sort) {
        m.delete();
        return;
    }

    let mentions = {};
    for(let key in teams) {
        const team = teams[key];

        await PlayerSortMatchModel.create(team);

        mentions[key] = [];
        team.map((player) => {
            mentions[key].push(userMention(player.user_id));
        })
    }

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Sorteio de jogadores')
        .setDescription(`O membro ${userMention(user.id)} sorteou os jogadores ${EmbedWhiteSpace()}`)
        .addFields(
            {
                name: "Atacantes",
                value: mentions.attacker.join("\n"),
                inline: true
            },
            {
                name: "Defensores",
                value: mentions.defender.join("\n"),
                inline: true
            }
        )

    await m.edit({
        embeds: [embed2]
    });

    await m.react('▶️');
}

module.exports = sortPlayers;