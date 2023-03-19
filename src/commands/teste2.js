const { AttachmentBuilder } = require('discord.js');

const VAPI = require('../helpers/ValorantAPI');

const ResultImage = require("../helpers/ResultImage");

async function teste2(client, msg, args) {
    const [ match_id ] = args;

    if(!match_id) {
        return;
    }

    const res = await VAPI.getMatch({
        match_id
    });

    if(res) {
        const match = res.data;

        const image = await ResultImage(match);
        
        const attachment = new AttachmentBuilder(image, { name: 'result.png' });

        msg.reply({
            files: [attachment]
        });
    }
}

module.exports = teste2;