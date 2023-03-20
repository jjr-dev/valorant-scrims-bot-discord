const { EmbedBuilder } = require('discord.js');

const AgentModel = require('../models/Agent');
const VAPI = require('../helpers/ValorantAPI');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');

async function agent(client, msg, args) {
    let name = args.join(" ");

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Buscando agente')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    if(!name) {
        DeleteMessage(m);
        return;
    }

    name = name.toLowerCase();

    let infos = await AgentModel.findOne({
        name
    });

    if(!infos) {
        const obj = await VAPI.getAgents({
            language: 'pt-BR',
            playable: true
        });

        if(obj.error) {
            console.log(`Erro VAPI ${obj.status}`, obj.errors);

            DeleteMessage(m);
            return;
        }

        const agents = obj.data;

        agents.forEach((agent) => {
            if(agent.displayName.toLowerCase() == name) {
                infos = agent;
                return;
            }
        })

        if(!infos) {
            DeleteMessage(m);
            return;
        }

        await AgentModel.create({
            uuid: infos.uuid,
            name: infos.displayName.toLowerCase()
        })
    } else {
        const obj = await VAPI.getAgent({
            agent_id: infos.uuid,
            language: 'pt-BR',
        });

        if(obj.error) {
            console.log(`Erro VAPI ${obj.status}`, obj.errors);

            DeleteMessage(m);
            return;
        }

        infos = obj.data;
    }

    const slots = {
        names: {
            Ability1: "Q",
            Ability2: "E",
            Grenade:  "C",
            Ultimate: "X"
        },
        position: ["Q", "E", "C", "X"]
    };

    const abilities = [];
    infos.abilities.forEach((ability, index) => {
        let key;

        if(slots[ability.slot])
            key = slots.names[ability.slot];
        else
            key = slots.position[index]

        abilities.push({
            name: `${key}: ${ability.displayName}`,
            value: ability.description
        })
    })

    const emoji = await msg.guild.emojis.cache.find(emoji => emoji.name === `pos_${infos.role.displayName.toLowerCase()}`);

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle(infos.displayName)
        .setDescription(infos.description)
        .setThumbnail(infos.displayIcon)
        .addFields([
            {
                name: "Função",
                value: `${emoji} ${infos.role.displayName} ${EmbedWhiteSpace()}`
            },
            ...abilities,
            {
                name: "Vídeos e dicas:",
                value: `https://blitz.gg/valorant/agents/${infos.displayName.toLowerCase()}`
            }
        ])

    await m.edit({
        embeds: [embed2]
    })
}

module.exports = agent;