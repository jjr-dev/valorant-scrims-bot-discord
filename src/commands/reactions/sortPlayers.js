const { EmbedBuilder, userMention } = require('discord.js');

const MatchModel = require('../../models/Match');
const PlayerMatchModel = require('../../models/PlayerMatch');
const PlayerSortMatchModel = require('../../models/PlayerSortMatch');
const SortMatchModel = require('../../models/SortMatch');
const PlayerModel = require('../../models/Player');
const BlockedPlayerModel = require('../../models/BlockedPlayer');

const EmbedWhiteSpace = require('../../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../../helpers/DeleteMessage');
const RemoveReaction = require('../../helpers/RemoveReaction');
const MemberElo = require('../../helpers/MemberElo');

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

    RemoveReaction(reaction, user);

    const match = await MatchModel.findOne({
        message_id: reaction.message.id
    })

    if(!match || match.creator_id != user.id) {
        DeleteMessage(m);
        return;
    }

    let players = await PlayerMatchModel.find({
        match_id: match._id
    });

    if(players.length < 2) {
        DeleteMessage(m);
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

    const players_mmr = {};
    win_rates.map((player) => {
        players_mmr[player.user_id] = player.win_rate * 100 + player.link_elo / 100;
    })

    players.map((player) => {
        if(players_mmr[player.user_id] === undefined)
            players_mmr[player.user_id] = 50;
    })

    const limit = 15;
    const range = 5;

    let difference;
    let teams;
    let teams_mmr;
    let blockeds;

    let best_sort = {
        difference: false,
        teams: {},
        teams_mmr: {}
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
    
        teams_mmr = {};
        teams_user_ids = {};
        for(let type in teams) {
            const team = teams[type];
    
            teams_mmr[type] = [];
            teams_user_ids[type] = [];
            team.map((player) => {
                teams_mmr[type].push(players_mmr[player.user_id]);
                teams_user_ids[type].push(player.user_id);
            })
        }

        blockeds = [];
        for(let type in teams_user_ids) {
            const ids = teams_user_ids[type];

            const team_blockeds = await BlockedPlayerModel.find({
                'user_id': {
                    $in: ids
                },
                'blocked_id': {
                    $in: ids
                }
            })

            if(team_blockeds.length > 0)
                blockeds.push(type);
        }
    
        for(let type in teams_mmr) {
            const team = teams_mmr[type];
    
            let total = 0;
            team.map((player) => {
                total += player;
            })
    
            teams_mmr[type] = total / team.length;
        }
    
        difference = teams_mmr['attacker'] - teams_mmr['defender'];
        if(difference < 0)
            difference = difference * -1;

        count ++;

        if(best_sort.difference === false || difference < best_sort.difference) {
            best_sort.teams      = teams;
            best_sort.teams_mmr  = teams_mmr;
            best_sort.difference = difference;
        }
    } while((difference > range || blockeds.length > 0) && count <= limit)

    if(count >= limit) {
        teams = best_sort.teams;
        teams_mmr = best_sort.teams_mmr;
    }

    const sorts = await SortMatchModel.find({
        match_id: match._id
    })

    sorts.map(async (sort) => {
        DeleteMessage(sort.message_id, channel);

        await PlayerSortMatchModel.deleteMany({
            sort_id: sort._id
        })
    })

    await SortMatchModel.deleteMany({
        match_id: match._id
    })

    await SortMatchModel.create({
        match_id: match._id,
        message_id: m.id
    });

    const sort = await SortMatchModel.findOne().sort({_id: -1});
    
    if(!sort) {
        DeleteMessage(m);
        return;
    }

    for(let type in teams) {
        const team = teams[type];

        let max = {
            win_rate: 0,
            index: null
        };

        team.map((player, index) => {
            const win_rate = players_mmr[player.user_id];

            teams[type][index]['sort_id']  = sort._id;
            teams[type][index]['captain']  = false;
            teams[type][index]['win_rate'] = win_rate;

            if(win_rate > max.win_rate) {
                max = {
                    win_rate: win_rate,
                    index: index
                };
            }
        })

        teams[type][max.index]['captain'] = true;
    }

    const guild   = reaction.message.guild;
    const members = await guild.members.fetch();

    let mentions = {};
    for(let key in teams) {
        const team = teams[key];

        await PlayerSortMatchModel.create(team);

        mentions[key] = [];
        for(let prop in team) {
            const player = team[prop];

            const elo = await MemberElo({
                user: player.user_id,
                guild,
                members
            });

            mentions[key].push(`${userMention(player.user_id)} (${(player.win_rate).toFixed(0)} mmr) ${player.captain ? "🎖️" : ""} ${elo.emoji ? elo.emoji : ''}`);

        }
    }

    const sidesNames = {
        attacker: `Atacantes (${(teams_mmr['attacker']).toFixed(0)} mmr)`,
        defender: `Defensores (${(teams_mmr['defender']).toFixed(0)} mmr)`
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
                value: mentions.attacker.join("\n") + EmbedWhiteSpace(),
                inline: true
            },
            {
                name: sidesNames.defender,
                value: mentions.defender.join("\n") + EmbedWhiteSpace(),
                inline: true
            }
        )
        .setFooter({
            text: `O símbolo 🎖️ representa o capitão de cada time`
        })

    await m.edit({
        embeds: [embed2]
    });

    await m.react('▶️');
    
    RemoveReaction(reaction, user);
}

module.exports = sortPlayers;