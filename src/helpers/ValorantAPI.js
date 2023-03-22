const { apiKeyHDev } = require('../../configs.json')

class ValorantAPI {
    constructor() {
        this.url = {
            game: "https://api.henrikdev.xyz/valorant",
            assets: "https://valorant-api.com"
        }

        this.options = {
            headers: {
                Authorization: apiKeyHDev
            }
        };
    }

    getAccount({ name, tag, puuid, force = false }) {
        return new Promise(async (resolve, reject) => {
            if(typeof force !== "boolean")
                reject();

            let url = `${this.url.game}/v1`;

            if(name && tag)
                url += `/account/${name}/${tag}?force=${force}`;
            else if(puuid)
                url += `/by-puuid/account/${puuid}?force=${force}`;
            else
                reject();

            fetch(url, this.options)
                .then(async (res) => {
                    res = await res.json();

                    resolve(res);
                })
                .catch((err) => reject(err))
        })
    }

    getMatches({ puuid, region, filters = false }) {
        return new Promise(async (resolve, reject) => {
            let url = `${this.url.game}/v3/by-puuid/matches/${region}/${puuid}`

            if(filters) {
                const strs = [];
                for(let key in filters) {
                    const val = filters[key];
                    strs.push(`${key == 'type' ? 'filter' : key}=${val}`);
                }

                url += `?${strs.join('&')}`;

                fetch(url, this.options)
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
            const url = `${this.url.game}/v2/match/${match_id}`

            fetch(url, this.options)
                .then(async (res) => {
                    res = await res.json();

                    resolve(res);
                })
                .catch((err) => reject(err))
        })
    }

    getAgents({ language = false, playable = true }) {
        return new Promise(async (resolve, reject) => {
            let url = `${this.url.assets}/v1/agents`

            const querys = [];
            if(language) querys.push(`language=${language}`);
            if(playable) querys.push(`isPlayableCharacter=${playable}`);

            if(querys.length > 0)
                url += `?${querys.join('&')}`;
            
            fetch(url, this.options)
                .then(async (res) => {
                    res = await res.json();

                    resolve(res);
                })
                .catch((err) => reject(err))
        })
    }

    getAgent({ agent_id, language = false }) {
        return new Promise(async (resolve, reject) => {
            let url = `${this.url.assets}/v1/agents/${agent_id}`

            if(language )
                url += `?language=${language}`
            
            fetch(url, this.options)
                .then(async (res) => {
                    res = await res.json();

                    resolve(res);
                })
                .catch((err) => reject(err))
        })
    }
}

module.exports = new ValorantAPI();