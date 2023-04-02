const { EmbedBuilder, userMention } = require('discord.js');

const PlayerModel = require('../models/Player');

const VAPI = require('../helpers/ValorantAPI');
const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');
const MemberElo = require('../helpers/MemberElo');

async function player(client, msg, args) {
    const [ user ] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Buscando jogador')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    const user_id = user ? user.slice(0, -1).slice(2) : msg.author.id;

    let player = await PlayerModel.findOne({
        user_id
    });

    let account;
    if(player && player.link_id) {
        let obj = await VAPI.getAccount({
            puuid: player.link_id,
            force: true
        })

        if(!obj.errors)
            account = obj.data;
    }

    const elo = player ? await MemberElo({
        guild: msg.guild,
        user: player.user_id
    }) : false;

    if(player && !player.link_elo)
        player.link_elo = 0;

    if(player && !player.win_rate)
        player.win_rate = 0.5;

    if(!player)
        player = {
            link_elo: 0,
            win_rate: 0.5
        };

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Dados do jogador')
        .setDescription(`Informações do jogador ${user ? userMention(user_id) : msg.author} ${EmbedWhiteSpace()}`)
        .addFields([
            {
                name: "Vitórias",
                value: player.matches ? `${player.matches_won}/${player.matches} \`(${(player.win_rate * 100).toFixed(0)}%)\`` : "0/0",
                inline: true
            },
            {
                name: "Elo",
                value: elo.name ? elo.emoji ? `${elo.emoji} ${elo.name}` : `${elo.name}` : "Indefinido",
                inline: true
            },
            {
                name: 'MMR',
                value: `${(player.win_rate * 100 + player.link_elo / 100).toFixed(0)}`,
                inline: true
            }
        ])

    if(account)
        embed2.setImage(account.card.wide)

    m.edit({
        embeds: [embed2]
    });
}

module.exports = player;