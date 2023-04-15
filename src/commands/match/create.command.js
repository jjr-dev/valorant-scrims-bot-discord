const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const MatchModel = require('../../models/match.model');
const EmbedBuilderHelper = require('../../helpers/embedbuilder.helper')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("criar")
        .setDescription("Criar partida SCRIM"),
    async execute(interaction) {
        await interaction.deferReply();

        const m = await interaction.fetchReply();

        const match = await MatchModel.create({
            message_id: m.id,
            creator_id: interaction.user.id
        })

        const client = interaction.client;

        const embed = EmbedBuilderHelper(client)
            .setTitle('Partida criada')
            .setDescription("Utilize o botão abaixo para confirmar sua presença")
            .setFooter({
                text: `ID da partida: ${match._id}`
            })

        const enter = new ButtonBuilder()
            .setCustomId('match-enter')
            .setLabel('Confirmar presença')
            .setStyle(ButtonStyle.Success)

        const list = new ButtonBuilder()
            .setCustomId('match-list')
            .setLabel('Listar presenças')
            .setStyle(ButtonStyle.Secondary)

        const map = new ButtonBuilder()
            .setCustomId('match-sortmap')
            .setLabel('Sortear mapa')
            .setStyle(ButtonStyle.Primary)

        const sort = new ButtonBuilder()
            .setCustomId('match-sortteams')
            .setLabel('Sortear times')
            .setStyle(ButtonStyle.Danger)

        const actions = new ActionRowBuilder()
            .addComponents(enter, list, map, sort)

        await interaction.editReply({
            embeds: [embed],
            components: [actions]
        });
    }
}