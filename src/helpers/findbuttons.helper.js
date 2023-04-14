const fs = require('node:fs');
const path = require('node:path');

module.exports = () => {
    const buttons = [];

    const foldersPath = path.join(__dirname, '../buttons');
    const commandFolders = fs.readdirSync(foldersPath);

    for(const folder of commandFolders) {
        const buttonsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

        for(const file of commandFiles) {
            const filePath = path.join(buttonsPath, file);
            const command = require(filePath);

            if('data' in command && 'execute' in command) {
                buttons.push(command);
            } else {
                console.log(`[AVISO] O botão ${filePath} não possui a propriedade "data" ou "execute"`);
            }
        }
    }

    return buttons;
}