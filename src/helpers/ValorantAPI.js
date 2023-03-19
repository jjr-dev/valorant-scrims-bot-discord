class ValorantAPI {
    constructor() {
        this.url = "https://api.henrikdev.xyz/valorant";
    }

    getAccount({ name, tag, puuid, force = false }) {
        return new Promise(async (resolve, reject) => {
            if(typeof force !== "boolean")
                reject();

            let url;

            if(name && tag)
                url = `${this.url}/v1/account/${name}/${tag}?force=${force}`;
            else if(puuid)
                url = `${this.url}/v1/by-puuid/account/${puuid}?force=${force}`;
            else
                reject();

            fetch(url)
                .then(async (res) => {
                    res = await res.json();

                    resolve(res);
                })
                .catch((err) => reject(err))
        })
    }

    getMatches({ puuid, region, filters = false }) {
        return new Promise(async (resolve, reject) => {
            let url = `${this.url}/v3/by-puuid/matches/${region}/${puuid}`

            if(filters) {
                const strs = [];
                for(let key in filters) {
                    const val = filters[key];
                    strs.push(`${key == 'type' ? 'filter' : key}=${val}`);
                }

                url += `?${strs.join('&')}`;

                fetch(url)
                    .then(async (res) => {
                        res = await res.json();

                        resolve(res);
                    })
                    .catch((err) => reject(err))
            }
        })
    }

    getMatch({ match_id }) {
        return new Promise(async (resolve, reject) => {
            const url = `${this.url}/v2/match/${match_id}`

            fetch(url)
                .then(async (res) => {
                    res = await res.json();

                    resolve(res);
                })
                .catch((err) => reject(err))
        })
    }
}

module.exports = new ValorantAPI();