const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const command = interaction.client.commands.get(interaction.commandName);
        const button  = interaction.client.buttons.get(interaction.customId);

        if((interaction.isChatInputCommand() || interaction.isAutocomplete()) && !command) {
            console.log(`[ERRO] Comando ${interaction.commandName} não encontrado`);
            return;
        }

        if(interaction.isButton() && !button) {
            console.log(`[ERRO] Botão ${interaction.customId} não encontrado`);
            return;
        }
        
        try {
            if(interaction.isChatInputCommand())
                await command.execute(interaction);
            else if(interaction.isAutocomplete())
                await command.autocomplete(interaction);
            else if(interaction.isButton())
                await button.execute(interaction);
        } catch(err) {
            if(interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "Ocorreu um erro ao executar este comando",
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: "Ocorreu um erro ao executar este comando",
                    ephemeral: true
                });
            }
        }
    }
}