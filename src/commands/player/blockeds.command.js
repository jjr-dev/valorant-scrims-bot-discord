const { SlashCommandBuilder, userMention } = require('discord.js');

const BlockedPlayerModel = require('../../models/blockedplayer.model');
const EmbedBuilderHelper = require('../../helpers/embedbuilder.helper')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bloqueados")
        .setDescription("Listar jogadores(as) bloqueados(as)"),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const blockeds = await BlockedPlayerModel.find({
            user_id: interaction.user.id
        });

        if(blockeds.length == 0) {
            await interaction.editReply("Nenhum jogador bloqueado");
            return;
        } 

        const mentions = [];
        for(const blocked of blockeds) {
            mentions.push(userMention(blocked.blocked_id));
        }

        const client = interaction.client;
        
        const embed = EmbedBuilderHelper(client)
            .setTitle('Jogadores(as) bloqueados(as)')
            .addFields({
                name: "Lista:",
                value: mentions.join("\n")
            })

        await interaction.editReply({
            embeds: [embed]
        });
    }
}