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
            }
        }
    }
   
}

module.exports = voice;