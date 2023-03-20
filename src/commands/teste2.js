const { AttachmentBuilder } = require('discord.js');

const VAPI = require('../helpers/ValorantAPI');

const ResultImage = require("../helpers/ResultImage");

async function teste2(client, msg, args) {
    const [ match_id ] = args;

    if(!match_id) {
        return;
    }

    const channel = await client.channels.cache.get("1087450850114424873");

    const res = await VAPI.getMatch({
        match_id
    });

    if(res) {
        const match = res.data;

        if(!match)
            return;

        const image = await ResultImage(match);

        if(image) {
            const attachment = new AttachmentBuilder(image, { name: 'result.png' });

            await channel.send({
                files: [attachment]
            })
        }
    }
}

module.exports = teste2;