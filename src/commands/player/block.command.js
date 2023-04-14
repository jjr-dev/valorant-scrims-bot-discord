const { SlashCommandBuilder  } = require('discord.js');

const PlayerModel = require('../../models/player.model');
const BlockedPlayerModel = require('../../models/blockedplayer.model');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bloquear")
        .setDescription("Bloquear jogador")
        .addMentionableOption(option => 
            option.setName('jogador')
                .setDescription('Jogador que deseja bloquear')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const member = interaction.options.getMentionable('jogador');

        const limit = 3;

        if(!member) {
            await interaction.editReply(`Membro ${member} não encontrado`);
            return;
        }

        const player = await PlayerModel.find({
            user_id: member.user.id
        });

        if(player.length == 0) {
            await interaction.editReply(`Jogador(a) ${member} não encontrado(a)`);
            return;
        }

        const blockeds = await BlockedPlayerModel.find({
            user_id: interaction.user.id
        });

        const blocked = blockeds.find(block => block.blocked_id == member.user.id);

        if(blocked) {
            await interaction.editReply(`Jogador(a) ${member} já bloqueado(a)`);
            return;
        }

        if(member.user.id == interaction.user.id) {
            await interaction.editReply(`Não é possível bloquear a si mesmo`);
            return;
        }

        if(blockeds.length >= limit) {
            await interaction.editReply(`Limite de bloqueios atingido!`);
            return;
        }

        await BlockedPlayerModel.create({
            user_id: interaction.user.id,
            blocked_id: member.user.id
        });

        await interaction.editReply(`O jogador ${member} foi bloqueado`);
    }
}