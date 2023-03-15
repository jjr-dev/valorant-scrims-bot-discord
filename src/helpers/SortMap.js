const MapSortModel = require('../models/MapSort');

async function SortMap() {
    return new Promise((resolve, reject) => {
        const url = 'https://valorant-api.com/v1/maps';

        fetch(url)
            .then(async (res) => {
                const sorts = await MapSortModel.find().sort({
                    'created_at': -1
                })

                const drawn = [];
                if(sorts.length > 0) {
                    sorts.forEach((sort) => {
                        drawn.push(sort.uuid);
                    })
                }

                res = await res.json();

                if(res.status !== 200)
                    throw "Error status code";

                const maps = res.data;

                maps.map((map, index) => {
                    if(!map.callouts)
                        maps.splice(index, 1);
                })

                maps.sort();

                const limit = maps.length;

                let map;
                let count  = 0;
                let sorted = false;

                do {
                    const random = Math.floor(Math.random() * maps.length);
                    map = maps[random];
    
                    await MapSortModel.create({
                        uuid: map.uuid
                    })
    
                    count ++;
                    if(drawn.includes(map.uuid) && count < limit) {
                        maps.splice(random, 1);
                        maps.sort();
                    } else {
                        sorted = true;
                    }
                } while(!sorted)

                if(count >= limit) 
                    await MapSortModel.deleteMany({
                        'user_id': {
                            $in: drawn
                        }
                    })

                resolve(map);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            })
    })
}

module.exports = SortMap;