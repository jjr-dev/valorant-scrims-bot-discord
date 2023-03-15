async function DeleteMessage(client, message, channel = false) {
    if(channel) {
        channel = typeof channel === 'object' ? channel.id : channel;
    } else if(typeof message === 'object' && message.channel) {
        channel = message.channel.id;
    } else {
        console.log("Err 1");
    }

    message = typeof message === 'object' ? message.id : message;

    client.channels.cache.get(channel).messages.fetch(message)
        .then((msg) => {
            msg.delete();
        })
        .catch((err) => {
            if (err.status !== 404)
                console.log(err);
        })
}

module.exports = DeleteMessage;