const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./configs.json');

const commandsData = [];

const commands = require('./src/helpers/findcommands.helper');

for(const command of commands()) {
    commandsData.push(command.data.toJSON());
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commandsData.length} application (/) commands`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {
                body: commandsData
            }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands`);
    } catch (err) {
        console.log(err);
    }
})();