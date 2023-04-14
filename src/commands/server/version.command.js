const { SlashCommandBuilder } = require('discord.js');
const { version } = require('../../../configs.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("versão")
        .setDescription("Obter versão atual"),
    async execute(interaction) {
        await interaction.reply({
            content: `Versão atual: \`${version}\``,
            ephemeral: true
        });
    }
}