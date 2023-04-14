const fs = require('node:fs');
const path = require('node:path');

module.exports = () => {
    const commands = [];

    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for(const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for(const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if('data' in command && 'execute' in command) {
                commands.push(command);
            } else {
                console.log(`[AVISO] O comando ${filePath} não possui a propriedade "data" ou "execute"`);
            }
        }
    }

    return commands;
}