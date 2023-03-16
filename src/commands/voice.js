const ChannelMatchModel = require('../models/ChannelMatch');

async function voice(client, oldChannel, newCannel) {
    if(oldChannel.channel) {
        const channel = oldChannel.channel
        const members = channel.members;

        if(members.size === 0) {
            const verify = await ChannelMatchModel.findOne({
                channel_id: channel.id
            })

            if(verify) {
                channel.fetch()
                    .then((c) => {
                        c.delete();
                    })
                    .catch((err) => {
                        if(err.status !== 404)
                            console.log(err);
                    })

                await ChannelMatchModel.updateOne({
                    _id: verify._id,
                }, {
                    deleted: true
                })

                const verify_category = await ChannelMatchModel.find({
                    match_id: verify.match_id,
                    deleted: true
                });

                if(verify_category.length >= 2) {
                    const category = await oldChannel.guild.channels.cache.get(verify.category_id);
                    
                    if(category)
                        category.fetch()
                            .then((c) => {
                                c.delete();
                            })
                            .catch((err) => {
                                if(err.status !== 404)
                                    console.log(err);
                            })
                }

            }
        }
    }
   
}

module.exports = voice;