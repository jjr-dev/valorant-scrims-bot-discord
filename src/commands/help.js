const { EmbedBuilder } = require('discord.js');

const { prefix } = require('../../configs.json');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');

async function help(client, msg, args) {
    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Chamando reforços')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.channel.send({
        embeds: [embed1]
    });

    const embed2 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Como utilizar o BOT')
        .setDescription(`O membro ${msg.author} acionou reforços ${EmbedWhiteSpace()}`)
        .addFields([
            {
                name: "Criar SCRIM",
                value: `${prefix}create \`team_players\``,
            },
            {
                name: "Ver partidas de membro",
                value: `${prefix}matches \`user_mention\``,
            },
            {
                name: "Ver partidas de todos os membros 🛠️",
                value: `${prefix}listmatches \`page\` \`limit\` \`order\``,
            },
            {
                name: "Definir partidas de membro 👑",
                value: `${prefix}setmatches \`user_mention*\` \`matches_won*\` \`matches*\``,
            },
            {
                name: "Sortear mapa",
                value: `${prefix}sortmap`,
            },
            {
                name: "Ver comandos",
                value: `${prefix}help`,
            },
            {
                name: "Ver ping",
                value: `${prefix}ping`,
            },
            {
                name: "Ver versão atual",
                value: `${prefix}version ${EmbedWhiteSpace()}`,
            },
            {
                name: `Avisos:`,
                value: `
                - Variáveis com \`*\` são obrigatórias
                - Comandos com \`👑\` só podem ser executados por cargos específicos
                - Comandos com \`🛠️\` estão em desenvolvimento`,
            }
        ])

    m.edit({
        embeds: [embed2]
    });

    DeleteMessage(client, msg);
}

module.exports = help;