const { EmbedBuilder, userMention } = require('discord.js')

const MatchModel = require('../models/Match');
const PlayerMatchModel = require('../models/PlayerMatch');
const PlayerModel = require('../models/Player');
const BlockedPlayerModel = require('../models/BlockedPlayer');
const MapSortMatchModel = require('../models/MapSortMatch');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');
const PlayerMapRanking = require('../helpers/PlayerMapRanking');

async function teste3(client, msg, args) {
    msg.delete();

    const channel = msg.channel;

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
        message_id: "1089307921210421388"
    })

    if(!match) {
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

    const map = await MapSortMatchModel.findOne({
        match_id: match._id,
    });

    const map_wr = {};
    const ranking = await PlayerMapRanking(map.name);
    for(let prop in ranking.list) {
        const player = ranking.list[prop];

        map_wr[player.id] = player.wr;
    }

    const players_mmr = {};
    const players_mmr_details = {};
    win_rates.map((player) => {
        const mwr = map_wr[player.user_id] ? map_wr[player.user_id] : 0;

        players_mmr[player.user_id] = player.win_rate * 100 + player.link_elo / 100 + mwr * 15;
        
        players_mmr_details[player.user_id] = {
            mwr: (mwr * 100).toFixed(0),
            gwr: (player.win_rate * 100).toFixed(0),
            elo: (player.link_elo / 100).toFixed(0)
        }
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

        console.log(`Sorteio: ${count}`);
        console.log(`Bloqueios: ${blockeds.length}`);
    } while((difference > range || blockeds.length > 0) && count <= limit)

    if(count >= limit) {
        teams = best_sort.teams;
        teams_mmr = best_sort.teams_mmr;
    }

    for(let type in teams) {
        const team = teams[type];

        let max = {
            win_rate: 0,
            index: null
        };

        team.map((player, index) => {
            const win_rate = players_mmr[player.user_id];

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

    let mentions = {};
    for(let key in teams) {
        const team = teams[key];

        mentions[key] = [];
        team.map((player) => {
            mentions[key].push(`${userMention(player.user_id)} (${(player.win_rate).toFixed(0)} \`${players_mmr_details[player.user_id].gwr}g | ${players_mmr_details[player.user_id].mwr}m | ${players_mmr_details[player.user_id].elo}e\`) ${player.captain ? "🎖️" : ""}`);
        })
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
        .setDescription(`Sorteio teste de jogadores no mapa ${map.name} ${EmbedWhiteSpace()}`)
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
}

module.exports = teste3;