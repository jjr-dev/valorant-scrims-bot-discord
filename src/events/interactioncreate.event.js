const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);
    
        if(!command) {
            console.log(`[ERROR] No command matching ${interaction.commandName} was found`);
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
                    content: "There was an error while executing this command!",
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                });
            }
        }
    }
}