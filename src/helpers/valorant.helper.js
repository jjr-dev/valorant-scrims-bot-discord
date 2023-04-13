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