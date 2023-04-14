const { SlashCommandBuilder } = require('discord.js');

const BlockedPlayerModel = require('../../models/blockedplayer.model');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("desbloquear")
        .setDescription("Desbloquear jogador")
        .addMentionableOption(option => 
            option.setName('jogador')
                .setDescription('Jogador que deseja desbloquear')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const member = interaction.options.getMentionable('jogador');

        if(!member) {
            await interaction.editReply(`Membro ${member} não encontrado`);
            return;
        }

        if(!member.user) {
            await interaction.editReply(`Cite um membro do servidor para desbloquear`);
            return;
        }

        const blocked = await BlockedPlayerModel.findOne({
            user_id: interaction.user.id,
            blocked_id: member.user.id
        });

        if(!blocked) {
            await interaction.editReply(`Jogador ${member} não bloqueado`);
            return;
        }

        await BlockedPlayerModel.deleteOne({
            _id: blocked.id
        });

        await interaction.editReply(`O jogador ${member} foi desbloqueado`);
    }
}