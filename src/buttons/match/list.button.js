const { userMention } = require('discord.js');

const MatchModel = require('../../models/match.model');
const PlayerMatchModel = require('../../models/playermatch.model');
const EmbedBuilderHelper = require('../../helpers/embedbuilder.helper')

module.exports = {
    data: {
        name: 'match-list'
    },
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const match = await MatchModel.findOne({
            message_id: interaction.message.id
        })

        const players = await PlayerMatchModel.find({
            match_id: match._id
        });

        const mentions = [];
        for(const player of players) {
            mentions.push(userMention(player.user_id));
        }

        const client = interaction.client;

        const embed = EmbedBuilderHelper(client)
            .setTitle('Lista de jogadores(as)')
            .addFields({
                name: "Jogadores(as) confirmados(as)",
                value: mentions.length > 0 ? mentions.join("\n") : "Nenhum(a) jogador(ar) confirmado(a)"
            })
            .setFooter({
                text: `ID da partida: ${match._id}`
            })

        await interaction.editReply({
            embeds: [embed]
        });
    }
}