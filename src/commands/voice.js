const ChannelMatchModel = require('../models/ChannelMatch');

async function voice(client, oldChannel, newCannel) {
    if(oldChannel.channel) {
        const channel = oldChannel.channel
        const members = channel.members;

        if(members.size === 0) {
            const verify = await ChannelMatchModel.findOne({
                channel_id: channel.id
            })

            if(verify)
                channel.delete();
        }
    }
   
}

module.exports = voice;