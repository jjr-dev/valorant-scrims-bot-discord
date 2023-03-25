const { EmbedBuilder } = require('discord.js');

const PlayerModel = require('../models/Player');
const { prefix } = require('../../configs.json'); 

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const LinkAccount = require('../helpers/LinkAccount');

async function update(client, msg, args) {
    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Atualizando conta')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    const player = await PlayerModel.findOne({
        user_id: msg.author.id
    })

    if(player && !player.link_id) {
        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Conta não atualizada')
            .setDescription(`Não existe uma conta vinculada ao seu usuário, tente utilizar o comando \`${prefix}link {name}#{tag}\` para vincular`);

        m.edit({
            embeds: [embed2]
        });

        return
    }

    const puuid = player.link_id;

    LinkAccount({ puuid, msg })
        .then((res) => {
            const { account, mmr, tier } = res;

            const embed2 = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle('Conta atualizada')
                .setDescription(`O membro ${msg.author} atualizou sua conta ${EmbedWhiteSpace()}`)
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
                        value: `${mmr.elo ? `${tier.translated} ${tier.division}` : "Sem elo"}`,
                        inline: true
                    }
                ])
                .setImage(account.card.wide)
                .setThumbnail(mmr.elo ? mmr.images.large : account.card.small)

            m.edit({
                embeds: [embed2]
            });
        })
        .catch((err) => {
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
                .setTitle('Conta não atualizada')
                .setDescription(error_msg)

            m.edit({
                embeds: [embed2]
            });
        })
}

module.exports = update;