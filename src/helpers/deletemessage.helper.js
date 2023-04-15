module.exports = ({ message, channel = false, client = false }) => {
    return new Promise(async (resolve, reject) => {
        if(typeof message === 'object') {
            await message.delete()
                .catch((err) => {
                    if (err.status !== 404)
                        console.log(err);

                    reject();
                })
        } else {
            if(typeof channel !== 'object')
                channel = client.channels.cache.get(channel);
    
            channel.messages.fetch(message)
                .then(async (msg) => {
                    await msg.delete();

                    resolve();
                })
                .catch((err) => {
                    if (err.status !== 404)
                        console.log(err);

                    reject();
                })
        }
    })
}