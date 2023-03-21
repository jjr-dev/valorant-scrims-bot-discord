const { EmbedBuilder, userMention } = require('discord.js');

const MatchModel = require('../../models/Match');
const PlayerMatchModel = require('../../models/PlayerMatch');

const EmbedWhiteSpace = require('../../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../../helpers/DeleteMessage');
const RemoveReaction = require('../../helpers/RemoveReaction');

async function listPlayers(client, reaction, user, add) {
    if(!add)
        return;

    const channel = client.channels.cache.get(reaction.message.channelId);

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Listando jogadores')
        .setDescription("`Por favor, aguarde...`")

    const m = await channel.send({
        embeds: [embed1]
    });

    RemoveReaction(reaction, user);

    const match = await MatchModel.findOne({
        message_id: reaction.message.id
    })

    if(!match) {
        DeleteMessage(m);
        return;
    }

    const players = await PlayerMatchModel.find({
        match_id: match._id
    });

    let mentions = [];
    if(players.length > 0) {
        players.map((player) => {
            mentions.push(userMention(player.user_id));
        })
    }

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Lista de jogadores')
        .setDescription(`O membro ${userMention(user.id)} listou os jogadores confirmados ${EmbedWhiteSpace()}`)
        .addFields(
            {
                name: `\`${players.length}\` ${players.length != 1 ? 'jogadores confirmados' : 'jogador confirmado'}`,
                value: players.length > 0 ? mentions.join("\n") : "Nenhum jogador confirmado"
            }
        )

    await m.edit({
        embeds: [embed2]
    });
}

module.exports = listPlayers;