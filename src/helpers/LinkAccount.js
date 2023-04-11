const VAPI = require('../helpers/ValorantAPI');
const PlayerModel = require('../models/Player');

const tiersList = require('../jsons/tiersList.json')

function LinkAccount({ name, tag, puuid, msg, guild = false, user = false }) {
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
    
            if(!guild && msg)
                guild = msg.guild;

            if(!user && msg)
                user = msg.author.id

            await PlayerModel.findOneAndUpdate({
                user_id: user
            }, {
                link_id: account.puuid,
                link_region: account.region,
                link_elo: mmr.elo ? mmr.elo : 0,
                link_date: Date.now()
            }, {
                upsert: true
            });

            guild.members.fetch(user)
                .then(async (member) => {
                    if(mmr.elo) {
                        tier.original = mmr.currenttierpatched;
            
                        let split = tier.original.split(' ');
                        tier.translated = tiersList[split[0].toLowerCase()];
                        tier.division   = split[1];
        
                        for(let prop in tiersList) {
                            const tier = tiersList[prop];
        
                            const role = await guild.roles.cache.find((r) => r.name === tier);
        
                            if(role)
                                await member.roles.remove(role.id);
                        }
        
                        let role = guild.roles.cache.find((r) => r.name === tier.translated);
            
                        if(!role)
                            role = await guild.roles.create({
                                name: tier.translated
                            })
            
                        await member.roles.add(role.id);

                        console.log(`Role updated: ${account.name}`);
                    }
        
                    member.setNickname(account.name)
                        .then(() => {
                            console.log(`Nickname set: ${account.name}`);
                        })
                        .catch((err) => {
                            console.log("Set nickname error", err);
                        })
                });
    
            resolve({ account, mmr, tier });
        } catch(err) {
            reject(err);
        }
    })
}

module.exports = LinkAccount;