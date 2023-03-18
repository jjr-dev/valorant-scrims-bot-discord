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
}

module.exports = new ValorantAPI();