const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const MatchModel = require('../../models/match.model');
const PlayerModel = require('../../models/player.model');
const PlayerMatchModel = require('../../models/playermatch.model');

module.exports = {
    data: {
        name: 'match-enter'
    },
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const match = await MatchModel.findOne({
            message_id: interaction.message.id
        })

        if(!match) {
            await interaction.editReply(`Partida não encontrada`);
            return;
        }

        const confirmed = await PlayerMatchModel.findOne({
            user_id: interaction.user.id,
            match_id: match._id
        });

        if(confirmed) {
            await interaction.editReply(`Presença já confirmada`);
            return;
        }

        const player = await PlayerModel.findOne({
            user_id: interaction.user.id
        })

        if(!player || player.link_elo == null || player.link_elo == undefined) {
            await interaction.editReply(`Vincule sua conta com \`/vincular\` para participar de partidas`);
            return;
        }

        const m = await interaction.fetchReply();

        await PlayerMatchModel.create({
            user_id: interaction.user.id,
            match_id: match._id,
            message_id: m.id
        })

        const leave = new ButtonBuilder()
            .setCustomId('match-leave')
            .setLabel('Cancelar presença')
            .setStyle(ButtonStyle.Danger)

        const actions = new ActionRowBuilder()
            .addComponents(leave)

        await interaction.editReply({
            content: "Presença confirmada!",
            components: [actions]
        });
    }
}