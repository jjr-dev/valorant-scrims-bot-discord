const PlayerSortMatchModel = require('../models/PlayerSortMatch');
const MapSortMatchModel = require('../models/MapSortMatch');
const VoteResultMatchModel = require('../models/VoteResultMatch');
const SortMatchModel = require('../models/SortMatch');

async function PlayerMapRanking(map) {
    return new Promise(async (resolve, reject) => {
        try {
            const ms = [];

            map = map.toLowerCase()
            map = map.charAt(0).toUpperCase() + map.slice(1);
    
            let count = 0;
    
            const matchs = await MapSortMatchModel.find({
                name: map
            }).limit(50);
    
            if(matchs.length == 0)
                throw "Sem partidas";
    
            for(let match of matchs) {
                const sorts = await SortMatchModel.find({
                    match_id: match.match_id
                })
    
                let players;
                for(let sort of sorts) {
                    players = await PlayerSortMatchModel.find({
                        sort_id: sort._id
                    })
                }
    
                const result = await VoteResultMatchModel.findOne({
                    match_id: match.match_id
                })
    
                if(result) {
                    count ++;
    
                    const obj = {
                        match_id: match.match_id,
                        players: {
                            w: [],
                            l: []
                        }
                    };
    
                    for(let player of players) {
                        obj.players[player.attacker === result.attacker ? 'w' : 'l'].push(player);
                    }
        
                    ms.push(obj)
                }
            }
    
            const players = {};
            for(let match of ms) {
                for(let type in match.players) {
                    const p = match.players[type]
    
                    for(let player of p) {
                        if(!players[player.user_id])
                            players[player.user_id] = {
                                w: 0,
                                l: 0
                            }
                        
                        players[player.user_id][type] ++;
                    }
                }
            }
    
            const org = [];
            for(let id in players) {
                const player = players[id];
    
                const t = player.w + player.l;
                const wr = player.w / t;
    
                org.push({
                    id,
                    w: player.w,
                    l: player.l,
                    t,
                    wr
                })
            }
            
            org.sort((a, b) => {
                return a.w > b.w ? -1 : 1;
            })
    
            org.sort((a, b) => {
                return a.wr > b.wr ? -1 : 1;
            })
    
            resolve({
                matches: count,
                list: org
            });
        } catch(err) {
            reject(err);
        }
    })
}

module.exports = PlayerMapRanking;