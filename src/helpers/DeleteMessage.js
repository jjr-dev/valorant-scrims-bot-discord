async function DeleteMessage(message, channel = false, client = false) {
    if(typeof message === 'object') {
        await message.delete()
            .catch((err) => {
                if (err.status !== 404)
                    console.log(err);
            })
    } else {
        if(typeof channel !== 'object')
            channel = client.channels.cache.get(channel);

        channel.messages.fetch(message)
            .then(async (msg) => {
                await msg.delete();
            })
            .catch((err) => {
                if (err.status !== 404)
                    console.log(err);
            })
    }
}

module.exports = DeleteMessage;