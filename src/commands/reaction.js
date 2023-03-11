const MatchModel = require('../models/Match');
const PlayerMatchModel = require('../models/PlayerMatch');

const { EmbedBuilder, userMention } = require('discord.js');

async function reaction(client, reaction, user, add) {
    if(user.bot)
        return;

    const emoji = reaction._emoji.name

    const channel = client.channels.cache.get(reaction.message.channelId);
    const dm      = client.users.cache.get(user.id);

    if(emoji === "✅") {
        const match = await MatchModel.findOne({
            message_id: reaction.message.id
        })

        if(!match) {
            dm.send(`A SCRIM que está reagindo foi removida ou já foi sorteada`);
            return;
        }

        if(add) {
            await PlayerMatchModel.create({
                user_id: user.id,
                match_id: match._id
            })
        } else {
            const playerMatch = await PlayerMatchModel.findOne({
                user_id: user.id,
                match_id: match._id
            });

            if(!playerMatch) {
                dm.send(`Você já não participa da SCRIM em que está tentando sair`);
                return;
            }

            await PlayerMatchModel.deleteOne({
                user_id: user.id,
                match_id: match._id
            })
        }
    } else
    if(emoji === "🎲") {
        if(!add)
            return;

        const match = await MatchModel.findOne({
            message_id: reaction.message.id
        })

        let players = await PlayerMatchModel.find({
            match_id: match._id
        });

        if(players.length < 2) {
            dm.send(`É necessário ao menos 2 jogadores para sortear`);
            return;
        }

        for(let i = 0; i < players.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }

        const teams = {
            attacker: [],
            defender: []
        }

        players.map((player, index) => {
            teams[index % 2 === 0 ? 'attacker' : 'defender'].push(userMention(player.user_id))
        })

        const embed1 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Sorteando jogadores')
            .setDescription("`Por favor, aguarde...`")

        const m = await channel.send({
            embeds: [embed1]
        });

        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Sorteio de jogadores')
            .setDescription(`O jogador ${userMention(user.id)} sorteou os jogadores para a **SCRIM**`)
            .addFields(
                {
                    name: "Atacantes",
                    value: teams.attacker.join("\n"),
                    inline: true
                },
                {
                    name: "Defensores",
                    value: teams.defender.join("\n"),
                    inline: true
                }
            )

        await m.edit({
            embeds: [embed2]
        });
    } else
    if(emoji === "🗺️") {
        channel.send("Em breve: Sorteio de mapa");
    }
}

module.exports = reaction;