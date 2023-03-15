const { EmbedBuilder, userMention } = require('discord.js');

const MatchModel = require('../../models/Match');
const PlayerSortMatchModel = require('../../models/PlayerSortMatch');
const VoteResultMatchModel = require('../../models/VoteResultMatch');
const SortMatchModel = require('../../models/SortMatch');
const PlayerModel = require('../../models/Player');

const EmbedWhiteSpace = require('../../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../../helpers/DeleteMessage');

async function resultMatch(attacker, client, reaction, user, add) {
    const channel = client.channels.cache.get(reaction.message.channelId);

    let m;
    if(add) {
        const embed1 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Registrando resultado')
            .setDescription("`Por favor, aguarde...`")

        m = await channel.send({
            embeds: [embed1]
        });
    }

    const match = await MatchModel.findOne({
        result_id: reaction.message.id
    })

    if(!match) {
        if(m) DeleteMessage(client, m);
        return;
    }

    const sort = await SortMatchModel.findOne({
        match_id: match._id
    });

    const captains = await PlayerSortMatchModel.find({
        sort_id: sort._id,
        captain: true
    });

    let verify = false;
    captains.map((captain) => {
        if(captain.user_id == user.id)
            verify = true;
    })

    if(!verify) {
        if(m) DeleteMessage(client, m);
        return;
    }
    
    await VoteResultMatchModel.deleteMany({
        user_id: user.id,
        match_id: match._id
    });

    if(!add) {
        if(m) DeleteMessage(client, m);
        return;
    }

    await VoteResultMatchModel.create({
        user_id: user.id,
        match_id: match._id,
        attacker
    });

    const votes = await VoteResultMatchModel.find({
        match_id: match._id
    })

    if(votes.length < 2) {
        if(m) DeleteMessage(client, m);
        return;
    }

    verify = true;

    let winner;
    votes.map((vote) => {
        const win = vote.attacker ? 'attacker' : 'defender';

        if(!winner)
            winner = win;
        else if(win != winner)
            verify = false;
    })

    if(!verify) {
        if(m) DeleteMessage(client, m);
        return;
    }

    const result = {
        winners: [],
        losers: []
    };

    result.winners = await PlayerSortMatchModel.find({
        sort_id: sort._id,
        attacker: winner == 'attacker'
    })

    result.losers = await PlayerSortMatchModel.find({
        sort_id: sort._id,
        attacker: winner == 'defender'
    })

    for(let type in result) {
        const users = result[type];

        users.map(async (user) => {
            const player = await PlayerModel.findOne({
                user_id: user.user_id
            })

            const matches     = (player ? player.matches : 0) + 1;
            const matches_won = (player ? player.matches_won : 0) + (type == 'winners' ? 1 : 0);
            const win_rate    = (matches_won / matches).toFixed(2);

            await PlayerModel.deleteOne({
                user_id: user.user_id
            });

            await PlayerModel.create({
                user_id: user.user_id,
                matches,
                matches_won,
                win_rate
            })
        })
    }

    let mentions = [];
    captains.map((captain) => {
        mentions.push(userMention(captain.user_id));
    })

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Resultado registrado')
        .setDescription(`Os capitães ${mentions.join(' e ')} definiram os ${winner == 'attacker' ? '**Atacantes**' : '**Defensores**'} como vencedores ${EmbedWhiteSpace()}`)
        .setFooter({
            text: `ID da partida: ${match._id}`
        })

    await m.edit({
        embeds: [embed2]
    });

    DeleteMessage(client, reaction.message);
}

module.exports = resultMatch;