const MatchModel = require('../../models/match.model');
const MapSortMatchModel = require('../../models/mapsortmatch.model');
const MapSortModel = require('../../models/mapsort.model');
const EmbedBuilderHelper = require('../../helpers/embedbuilder.helper');
const DeleteMessageHelper = require('../../helpers/deletemessage.helper');
const ValorantHelper = require('../../helpers/valorant.helper')

module.exports = {
    data: {
        name: 'match-sortmap'
    },
    async execute(interaction) {
        await interaction.deferReply();

        const match = await MatchModel.findOne({
            message_id: interaction.message.id
        });

        if(!match) {
            await interaction.editReply(`Partida não encontrada`);
            return;
        }

        if(match.creator_id != interaction.user.id) {
            await interaction.editReply(`Apenas o criador pode sortear o mapa`);
            return;
        }

        const obj = await ValorantHelper.getMaps({
            language: 'pt-BR'
        });

        if(obj.status !== 200) {
            await interaction.editReply(`Erro interno, tente novamente mais tarde`);
            return;
        }

        const maps = obj.data;

        const sorteds = await MapSortModel.find().sort({
            'created_at': -1
        })

        const drawn = [];
        for(const sorted of sorteds) {
            drawn.push(sorted.uuid);
        }

        for(const prop in maps) {
            if(!maps[prop].callouts)
                maps.splice(prop, 1);
        }

        maps.sort();

        let undrawn = maps.filter(map => !drawn.includes(map.uuid));
        
        if(undrawn.length == 0) {
            undrawn = maps.filter(map => map.uuid != drawn[drawn.length - 1]);

            await MapSortModel.deleteMany({
                'uuid': {
                    $in: drawn
                }
            })
        }

        const random = Math.floor(Math.random() * undrawn.length)
        const map = undrawn[random];

        await MapSortModel.create({
            uuid: map.uuid
        })

        const sorts = await MapSortMatchModel.find({
            match_id: match._id,
        })

        for(const sort of sorts) {
            DeleteMessageHelper({
                message: sort.message_id,
                channel: interaction.channel,
            }).catch((err) => {})
        }

        const client = interaction.client;

        const embed = EmbedBuilderHelper(client)
            .setTitle('Mapa sorteado')
            .setDescription(`${map.displayName}`)
            .setThumbnail(map.displayIcon)
            .setImage(map.splash)
            .setFooter({
                text: `ID da partida: ${match._id}`
            })

        await interaction.editReply({
            embeds: [embed]
        });

        await MapSortMatchModel.deleteMany({
            match_id: match._id,
        })

        const m = await interaction.fetchReply();
        
        await MapSortMatchModel.create({
            match_id: match._id,
            message_id: m.id,
            name: map.displayName
        })
    }
}