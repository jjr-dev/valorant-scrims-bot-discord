const MatchModel = require('../models/Match');
const PlayerMatchModel = require('../models/PlayerMatch');
const PlayerSortMatchModel = require('../models/PlayerSortMatch');
const SortMatchModel = require('../models/SortMatch');

const { EmbedBuilder, userMention, ChannelType } = require('discord.js');

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

        await SortMatchModel.create({
            match_id: match._id,
            message_id: m.id
        });

        const sort = await SortMatchModel.findOne().sort({_id: -1});

        players.map((player, index) => {
            const attacker = index % 2 === 0;
            teams[attacker ? 'attacker' : 'defender'].push({
                user_id: player.user_id,
                sort_id: sort._id,
                attacker
            });
        })
        
        if(!sort) {
            dm.send("Erro ao sortear os jogadores");
            m.delete();
            return;
        }

        let mentions = {};
        for(let key in teams) {
            const team = teams[key];

            await PlayerSortMatchModel.create(team);

            mentions[key] = [];
            team.map((player) => {
                mentions[key].push(userMention(player.user_id));
            })
        }

        const embed2 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Sorteio de jogadores')
            .setDescription(`O jogador ${userMention(user.id)} sorteou os jogadores`)
            .addFields(
                {
                    name: "Atacantes",
                    value: mentions.attacker.join("\n"),
                    inline: true
                },
                {
                    name: "Defensores",
                    value: mentions.defender.join("\n"),
                    inline: true
                }
            )

        await m.edit({
            embeds: [embed2]
        });

        await m.react('▶️');
    } else
    if(emoji === "🗺️") {
        if(!add)
            return;

        const embed1 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Sorteando Mapa')
            .setDescription("`Por favor, aguarde...`")

        const m = await channel.send({
            embeds: [embed1]
        });

        const url = 'https://valorant-api.com/v1/maps';

        fetch(url)
        .then(async (res) => {
            res = await res.json();

            if(res.status !== 200)
                throw "Error status code";

            const maps = res.data;

            maps.map((map, index) => {
                if(!map.callouts)
                    maps.splice(index, 1);
            })

            maps.sort();

            const random = Math.floor(Math.random() * maps.length);
            const map = maps[random];

            const embed2 = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle('Mapa sorteado')
                .setDescription(`O jogador ${userMention(user.id)} sorteou o mapa **${map.displayName}**`)
                .setThumbnail(map.displayIcon)
                .setImage(map.splash)

            await m.edit({
                embeds: [embed2]
            });
        })
        .catch((err) => {
            dm.send(`Ocorreu um erro ao sortear o mapa`);
            console.log(err);
        })
    } else
    if(emoji === "▶️") {
        if(!add)
            return;

        const embed1 = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('Separando jogadores')
            .setDescription("`Por favor, aguarde...`")

        const m = await channel.send({
            embeds: [embed1]
        });

        const sort = await SortMatchModel.findOne({
            message_id: reaction.message.id
        });

        const match = await MatchModel.findOne({
            _id: sort.match_id
        });

        const players = await PlayerSortMatchModel.find({
            sort_id: sort._id
        });

        const guild = reaction.message.guild;

        const ca = await guild.channels.create({
            name: "Atacantes",
            type: ChannelType.GuildVoice
        });

        const cd = await guild.channels.create({
            name: "Defensores",
            type: ChannelType.GuildVoice
        });

        players.map((player) => {
            const member = guild.members.cache.get(player.user_id);
            member.voice.setChannel(player.attacker ? ca : cd);
        })

        m.delete();
        reaction.message.delete();

        client.channels.cache.get(reaction.message.channelId).messages.fetch(match.message_id).then((msg) => {
            msg.delete();
        })
    }
}

module.exports = reaction;