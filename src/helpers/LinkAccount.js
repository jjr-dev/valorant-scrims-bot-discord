const VAPI = require('../helpers/ValorantAPI');
const PlayerModel = require('../models/Player');

function LinkAccount({ name, tag, puuid, msg }) {
    return new Promise(async (resolve, reject) => {
        try {
            let obj = await VAPI.getAccount({
                name,
                tag,
                puuid,
                force: true
            })
    
            if(obj.errors)
                throw obj;
    
            const account = obj.data;
    
            obj = await VAPI.getMMR({
                puuid: account.puuid,
                region: account.region
            })
    
            if(obj.errors)
                throw obj;
    
            const mmr = obj.data;
    
            const tier = {
                translated: null,
                division: null,
                original: null
            }
    
            if(mmr.elo) {
                const tiers = {
                    iron: "Ferro",
                    bronze: "Bronze",
                    silver: "Prata",
                    gold: "Ouro",
                    platinum: "Platina",
                    diamond: "Diamante",
                    ascendant: "Ascendente",
                    immortal: "Imortal",
                    radiant: "Radiante"
                }
    
                tier.original = mmr.currenttierpatched;
    
                let split = tier.original.split(' ');
                tier.translated = tiers[split[0].toLowerCase()];
                tier.division   = split[1];

                const guild = msg.guild;
    
                const member = await guild.members.cache.get(msg.author.id);

                for(let prop in tiers) {
                    const tier = tiers[prop];

                    const role = guild.roles.cache.find((r) => r.name === tier);

                    if(role)
                        await member.roles.remove(role.id);
                }

                let role = guild.roles.cache.find((r) => r.name === tier.translated);
    
                if(!role)
                    role = await guild.roles.create({
                        name: tier.translated
                    })
    
                if(member)
                    await member.roles.add(role.id);
            }
    
            await PlayerModel.findOneAndUpdate({
                user_id: msg.author.id
            }, {
                link_id: account.puuid,
                link_region: account.region,
                link_elo: mmr.elo ? mmr.elo : 0
            }, {
                upsert: true
            });
    
            resolve({ account, mmr, tier });
        } catch(err) {
            reject(err);
        }
    })
}

module.exports = LinkAccount;