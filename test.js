const { AttachmentBuilder } = require('discord.js');

const PlayerModel = require('./src/models/Player');
const VAPI = require('./src/helpers/ValorantAPI');

async function teste() {
    const players = await PlayerModel.find({
        link_id: {$ne: null}
    }).limit(10)

    const limit = 15;
    const range = 0.1;

    let teams;
    let difference;
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
                name: player.link_name ? player.link_name : "Ryanzin",
                wr: player.win_rate,
                elo: player.link_elo ? player.link_elo : 0
            });
        })

        teams_mmr = {};
        for(let type in teams) {
            const team = teams[type];
    
            teams_mmr[type] = [];
            team.map((player, index) => {
                const mmr = player.wr * 100 + player.elo / 10;

                teams[type][index]['mmr'] = mmr;
                teams_mmr[type].push(mmr);
            })
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

        console.log(`Sorteio ${count}`);

        if(best_sort.difference === false || difference < best_sort.difference) {
            best_sort.teams      = teams;
            best_sort.teams_mmr  = teams_mmr;
            best_sort.difference = difference;
        }
    } while(difference > range && count <= limit)

    if(count >= limit) {
        teams = best_sort.teams;
        teams_mmr = best_sort.teams_mmr;
    }

    console.log(teams);
    console.log(teams_mmr);
}

const database = require('./db');
database();
teste();