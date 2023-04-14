const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);
    
        if(!command) {
            console.log(`[ERRO] Comando ${interaction.commandName} não encontrado`);
            return;
        }

        try {
            if(interaction.isChatInputCommand())
                await command.execute(interaction);
            else if(interaction.isAutocomplete())
                await command.autocomplete(interaction)
        } catch(err) {
            console.log(err);
    
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