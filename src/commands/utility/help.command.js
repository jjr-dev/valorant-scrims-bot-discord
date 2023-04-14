const { SlashCommandBuilder } = require('discord.js');

const EmbedBuilderHelper = require('../../helpers/embedbuilder.helper')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ajuda")
        .setDescription("Listar comandos e funções"),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const commandsData = [];

        const commands = require('../../helpers/findcommands.helper');

        for(const command of commands()) {
            commandsData.push(command.data.toJSON());
        }

        const commandList = [];
        for(const command of commandsData) {
            const options = command.options;
            const optionList = [];

            for(const option of options) {
                optionList.push(`\`${option.name}${option.required ? "*" : ""}\``);
            }
            
            commandList.push({
                name: command.description,
                value: `/${command.name} ${optionList.join(" ")}`
            })
        }
        
        const client = interaction.client;

        const embed = EmbedBuilderHelper(client)
            .setTitle('Lista de comandos')
            .addFields(commandList)

        await interaction.editReply({
            embeds: [embed]
        });
    }
}