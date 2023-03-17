const { EmbedBuilder, ChannelType, userMention, PermissionsBitField } = require('discord.js');

const MatchModel = require('../../models/Match');
const PlayerSortMatchModel = require('../../models/PlayerSortMatch');
const SortMatchModel = require('../../models/SortMatch');
const ChannelMatchModel = require('../../models/ChannelMatch');
const MapSortMatchModel = require('../../models/MapSortMatch');

const EmbedWhiteSpace = require('../../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../../helpers/DeleteMessage');

async function play(client, reaction, user, add) {
    if(!add)
        return;

    const channel = client.channels.cache.get(reaction.message.channelId);

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Iniciando partida')
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

    if(!match || match.creator_id != user.id) {
        DeleteMessage(m);
        return;
    }

    const players = await PlayerSortMatchModel.find({
        sort_id: sort._id
    });

    const guild = reaction.message.guild;

    const role = await guild.roles.create({
        name: `Jogando`,
        reason: `Jogando a partida ${match._id}`
    })

    const everyone = guild.roles.cache.find((r) => r.name === '@everyone');

    const category = await guild.channels.create({
        name: `Partida ${match._id}`,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                id: everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: role.id,
                allow: [PermissionsBitField.Flags.ViewChannel]
            }
        ]
    })

    const ca = await guild.channels.create({
        name: "Equipe A",
        type: ChannelType.GuildVoice,
        parent: category.id,
        userLimit: match.player_limit ? match.player_limit : false
    });

    const cb = await guild.channels.create({
        name: "Equipe B",
        type: ChannelType.GuildVoice,
        parent: category.id,
        userLimit: match.player_limit ? match.player_limit : false
    });

    const teams = {
        'attacker': [],
        'defender': []
    }

    for(let prop in players) {
        const player = players[prop];

        const member = await guild.members.cache.get(player.user_id);

        if(member && member.voice.channel) 
            await member.voice.setChannel(player.attacker ? ca : cb);

        if(member)
            await member.roles.add(role.id);
        
        teams[player.attacker ? 'attacker' : 'defender'].push(player);
    }

    const channels = [ca, cb];
    channels.forEach(async (channel) => {
        await ChannelMatchModel.create({
            match_id: match._id,
            channel_id: channel.id,
        })
    })

    await MatchModel.updateOne({
        match_id: match._id
    }, {
        role_id: role.id,
        category_id: category.id
    })

    const map = await MapSortMatchModel.findOne({
        match_id: match._id,
    });

    DeleteMessage(reaction.message);
    DeleteMessage(match.message_id, reaction.message.channel);

    let mentions = {};
    for(let key in teams) {
        const team = teams[key];

        await PlayerSortMatchModel.create(team);

        mentions[key] = [];
        team.map((player) => {
            mentions[key].push(`${userMention(player.user_id)} ${player.captain ? "🎖️" : ""}`);
        })
    }

    await MatchModel.findOneAndUpdate({
        _id: match._id,
    }, {
        result_id: m.id
    });
    
    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Partida iniciada')
        .setDescription(`O membro ${userMention(user.id)} iniciou a partida ${EmbedWhiteSpace()}`)
        .addFields(
            {
                name: "Mapa",
                value: `${map ? map.name : "Indefinido"} ${EmbedWhiteSpace()}`
            },
            {
                name: "🅰️ - Atacantes",
                value: mentions.attacker.join("\n") + EmbedWhiteSpace(),
                inline: true
            },
            {
                name: "🅱️ - Defensores",
                value: mentions.defender.join("\n") + EmbedWhiteSpace(),
                inline: true
            },
            {
                name: "Como registrar o resultado",
                value: `
                    Vote em 🅰️ ou 🅱️ para registrar o resultado da partida. 
                    
                    **Avisos:**
                    • Apenas os capitães (🎖️) podem registrar o resultado
                    • O resultado é registrado apenas quando ambos votarem
                `
            }
        )
        .setFooter({
            text: `ID da partida: ${match._id}`
        })

    await m.edit({
        embeds: [embed2]
    })
    
    await m.react("🅰️");
    await m.react("🅱️");
}

module.exports = play;