const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Obter ping do servidor"),
    async execute(interaction) {
        const client = interaction.client;

        await interaction.reply({
            content: `Pong! \`${client.ws.ping}ms\``,
            ephemeral: true
        });
    }
}