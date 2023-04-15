const { apiKeyHDev } = require('../../configs.json')

this.url = {
    game: "https://api.henrikdev.xyz/valorant",
    assets: "https://valorant-api.com"
}

this.options = {
    headers: {
        Authorization: apiKeyHDev
    }
};

exports.getAccount = ({ username, tag, puuid, force = false }) => {
    return new Promise(async (resolve, reject) => {
        if(typeof force !== "boolean")
            reject();

        let url = `${this.url.game}/v1`;

        if(username && tag)
            url += `/account/${username}/${tag}?force=${force}`;
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

exports.getMMR = ({ puuid, region, filter = false }) => {
    return new Promise(async (resolve, reject) => {
        let url = `${this.url.game}/v1/by-puuid/mmr/${region}/${puuid}`

        if(filter)
            url += `?filter=${filter}`;

        fetch(url, this.options)
            .then(async (res) => {
                res = await res.json();

                resolve(res);
            })
            .catch((err) => reject(err))
    })
}

exports.getAgents = ({ language = false, playable = true }) => {
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

exports.getMaps = ({ language = false }) => {
    return new Promise(async (resolve, reject) => {
        let url = `${this.url.assets}/v1/maps`

        const querys = [];
        if(language) querys.push(`language=${language}`);

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