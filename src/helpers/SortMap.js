async function SortMap() {
    return new Promise((resolve, reject) => {
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

                resolve(map);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            })
    })
}

module.exports = SortMap;