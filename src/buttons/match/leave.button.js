const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const MatchModel = require('../../models/match.model');
const PlayerModel = require('../../models/player.model');
const PlayerMatchModel = require('../../models/playermatch.model');

module.exports = {
    data: {
        name: 'match-leave'
    },
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const confirmed = await PlayerMatchModel.findOne({
            user_id: interaction.user.id,
            message_id: interaction.message.id
        });

        if(!confirmed) {
            interaction.editReply("Presença não confirmada");
            return;
        }

        await PlayerMatchModel.deleteOne({
            user_id: interaction.user.id,
            match_id: confirmed.match_id
        });

        interaction.editReply("Presença cancelada!");
    }
}