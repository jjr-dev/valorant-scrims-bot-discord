const { EmbedBuilder } = require('discord.js');

const PlayerModel = require('../models/Player');
const VAPI = require('../helpers/ValorantAPI');
const { prefix } = require('../../configs.json'); 

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');

async function link(client, msg, args) {
    const name_tag = args.join(" ");

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Vinculando conta')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    if(!name_tag) {
        DeleteMessage(m);
        return;
    }

    const split = name_tag.split("#");

    if(split.length != 2) {
        DeleteMessage(m);
        return;
    }

    const [ name, tag ] = split;

    const verify = await PlayerModel.findOne({
        user_id: msg.author.id
    });

    if(verify && verify.link_id) {
        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Conta não vinculada')
            .setDescription(`Já existe uma conta vinculada ao seu usuário, tente utilizar o comando \`${prefix}unlink\` para desvincular`);

        m.edit({
            embeds: [embed2]
        });

        return
    }

    try {
        let obj = await VAPI.getAccount({
            name,
            tag,
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

        await PlayerModel.findOneAndUpdate({
            user_id: msg.author.id
        }, {
            link_id: account.puuid,
            link_region: account.region,
            link_elo: mmr.elo ? mmr.elo : 0
        }, {
            upsert: true
        });
        
        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Conta vinculada')
            .setDescription(`O membro ${msg.author} vinculou sua conta ${EmbedWhiteSpace()}`)
            .addFields([
                {
                    name: 'Usuário',
                    value: `${account.name}#${account.tag}`,
                    inline: true
                },
                {
                    name: 'Nível',
                    value: `${account.account_level}`,
                    inline: true
                },
                {
                    name: 'Elo',
                    value: `${mmr.elo ? mmr.currenttierpatched : "Sem elo"}`,
                    inline: true
                }
            ])
            .setImage(account.card.wide)
            .setThumbnail(mmr.elo ? mmr.images.large : account.card.small)

        m.edit({
            embeds: [embed2]
        });
    } catch(err) {
        if(err.status != 404)
            console.log(`Erro VAPI ${err.status}`, err.errors);

        let error_msg;
        if(err.status == 404)
            error_msg = "Usuário não encontrado";
        else
            error_msg = "Erro interno, tente novamente mais tarde";
        
        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Conta não vinculada')
            .setDescription(error_msg)

        m.edit({
            embeds: [embed2]
        });
    }
    
}

module.exports = link;