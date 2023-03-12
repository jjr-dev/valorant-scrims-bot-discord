const { EmbedBuilder, userMention } = require('discord.js');

const MatchModel = require('../../models/Match');
const PlayerMatchModel = require('../../models/PlayerMatch');
const PlayerSortMatchModel = require('../../models/PlayerSortMatch');
const SortMatchModel = require('../../models/SortMatch');
const PlayerModel = require('../../models/Player');

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

    const ids = [];
    players.map((player) => {
        ids.push(player.user_id);
    })

    const win_rates = await PlayerModel.find({
        'user_id': {
            $in: ids
        }
    })

    const players_win_rate = {};
    win_rates.map((player) => {
        players_win_rate[player.user_id] = player.win_rate ? player.win_rate : 0.5;
    })

    const limit = 10;
    const range = 0.15;

    let difference;
    let teams;
    let teams_win_rate;

    let best_sort = {
        difference: false,
        teams: {},
        teams_win_rate: {}
    }

    let count = 0;
    do {
        for(let i = 0; i < players.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }
    
        teams = {
            attacker: [],
            defender: []
        }
    
        players.map((player, index) => {
            const attacker = index % 2 === 0;
            teams[attacker ? 'attacker' : 'defender'].push({
                user_id: player.user_id,
                attacker
            });
        })
    
        teams_win_rate = {};
        for(let type in teams) {
            const team = teams[type];
    
            teams_win_rate[type] = [];
            team.map((player) => {
                teams_win_rate[type].push(players_win_rate[player.user_id])
            })
        }
    
        for(let type in teams_win_rate) {
            const team = teams_win_rate[type];
    
            let total = 0;
            team.map((player) => {
                total += player;
            })
    
            teams_win_rate[type] = total / team.length;
        }
    
        difference = teams_win_rate['attacker'] - teams_win_rate['defender'];
        if(difference < 0)
            difference = difference * -1;

        count ++;

        if(best_sort.difference === false || difference < best_sort.difference) {
            best_sort.teams          = teams;
            best_sort.teams_win_rate = teams_win_rate;
            best_sort.difference     = difference;
        }
    } while(difference > range && count <= limit)

    if(count >= limit) {
        teams = best_sort.teams;
        teams_win_rate = best_sort.teams_win_rate;
    }

    await SortMatchModel.create({
        match_id: match._id,
        message_id: m.id
    });

    const sort = await SortMatchModel.findOne().sort({_id: -1});
    
    if(!sort) {
        m.delete();
        return;
    }

    for(let type in teams) {
        const team = teams[type];

        team.map((player, index) => {
            teams[type][index]['sort_id'] = sort._id;
        })
    }

    let mentions = {};
    for(let key in teams) {
        const team = teams[key];

        await PlayerSortMatchModel.create(team);

        mentions[key] = [];
        team.map((player) => {
            mentions[key].push(`${userMention(player.user_id)} (${(players_win_rate[player.user_id] * 100).toFixed(0)}%)`);
        })
    }

    const sidesNames = {
        attacker: `Atacantes (${(teams_win_rate['attacker'] * 100).toFixed(0)}%)`,
        defender: `Defensores (${(teams_win_rate['defender'] * 100).toFixed(0)}%)`
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
                name: sidesNames.attacker,
                value: mentions.attacker.join("\n"),
                inline: true
            },
            {
                name: sidesNames.defender,
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