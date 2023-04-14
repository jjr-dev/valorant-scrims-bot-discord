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
        console.log(`Iniciando atualização de ${commandsData.length} comandos`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {
                body: commandsData
            }
        );

        console.log(`${data.length} comandos atualizados com sucesso`);
    } catch (err) {
        console.log(err);
    }
})();