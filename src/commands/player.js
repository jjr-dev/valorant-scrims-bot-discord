const { EmbedBuilder, userMention } = require('discord.js');

const PlayerSortMatchModel = require('../models/PlayerSortMatch');
const VoteResultMatchModel = require('../models/VoteResultMatch');
const SortMatchModel = require('../models/SortMatch');
const PlayerModel = require('../models/Player');

const VAPI = require('../helpers/ValorantAPI');
const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');
const MemberElo = require('../helpers/MemberElo');

async function player(client, msg, args) {
    const [ user, ...configs ] = args;

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
    if(player && player.link_id && !configs.includes('--fast')) {
        let obj = await VAPI.getAccount({
            puuid: player.link_id,
            force: true
        })

        if(!obj.errors)
            account = obj.data;
    }

    let history = [];
    if(player && !configs.includes('--fast')) {
        const sorts = await PlayerSortMatchModel.find({
            user_id: player.user_id
        }).limit(15);

        const matches = [];
        for(let prop in sorts) {
            const sort = sorts[prop];

            const match = await SortMatchModel.findOne({
                _id: sort.sort_id
            });

            if(match) {
                matches.push({
                    id: match.match_id,
                    sort: sort._id,
                    attacker: sort.attacker
                });
            }
        }

        const results = [];
        for(let prop in matches) {
            const match = matches[prop];

            const result = await VoteResultMatchModel.findOne({
                match_id: match.id
            })

            if(result)
                results.push(result.attacker == match.attacker)
        }

        for(let prop in results) {
            if(prop >= 10)
                break;

            const result = results[prop];

            history.push(result ? "🟩" : "🟥");
        }
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
                name: "MMR",
                value: `${(player.win_rate * 100 + player.link_elo / 100).toFixed(0)}`,
                inline: true
            }
        ]);

    if(account)
        embed2.setImage(account.card.wide)

    if(history.length > 0)
        embed2.addFields({
            name: "Histórico",
            value: history.join(' ')
        })

    m.edit({
        embeds: [embed2]
    });
}

module.exports = player;