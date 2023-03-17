const ChannelMatchModel = require('../models/ChannelMatch');
const MatchModel = require('../models/Match');

async function voice(client, oldChannel, newCannel) {
    if(oldChannel.channel) {
        const channel = oldChannel.channel;
        const guild   = oldChannel.guild;
        const members = channel.members;

        if(members.size === 0) {
            const verify = await ChannelMatchModel.findOne({
                channel_id: channel.id
            })

            if(verify) {
                channel.delete()
                    .catch((err) => {
                        if(err.status !== 404)
                            console.log(err);
                    })

                await ChannelMatchModel.deleteOne({
                    _id: verify._id,
                })

                const verify_category = await ChannelMatchModel.find({
                    match_id: verify.match_id
                });

                if(verify_category.length == 0) {
                    const match = await MatchModel.findOne({
                        match_id: verify.match_id,
                    });

                    const category = await guild.channels.cache.get(match.category_id);
                    const role = await guild.roles.cache.get(match.role_id);
                    
                    if(category) {
                        category.delete()
                            .catch((err) => {
                                if(err.status !== 404)
                                    console.log(err);
                            })
                    }

                    if(role) {
                        role.delete()
                            .catch((err) => {
                                if(err.status !== 404)
                                    console.log(err);
                            })
                    }
                }

            }
        }
    }
   
}

module.exports = voice;