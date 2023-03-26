const { EmbedBuilder, userMention } = require('discord.js');

const EmbedWhiteSpace = require('../helpers/EmbedWhiteSpace');
const DeleteMessage = require('../helpers/DeleteMessage');
const PlayerMapRanking = require('../helpers/PlayerMapRanking');

async function ranking(client, msg, args) {
    let [map] = args;

    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Listando ranking')
        .setDescription("`Por favor, aguarde...`")

    const m = await msg.reply({
        embeds: [embed1]
    });

    if(map) {
        PlayerMapRanking(map)
            .then(async (res) => {
                const limit = 10;
                const ranking = [];

                for(let index in res.list) {
                    if(index < limit) {
                        const player = res.list[index];
                        ranking.push(`${parseInt(index) + 1}º - ${userMention(player.id)} | ${(player.wr * 100).toFixed(0)}% \`(${player.w}/${player.t})\``)
                    }
                }
        
                const embed2 = new EmbedBuilder()
                    .setColor("Random")
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTitle(`Ranking **${map}**`)
                    .setDescription(`Melhores jogadores do mapa \`(${res.matches} partidas)\``)
                    .addFields(
                        {
                            name: "Lista",
                            value: ranking.join("\n") + EmbedWhiteSpace()
                        }
                    )
                    .setFooter({
                        text: "⚠️ A posição no Ranking é baseada na taxa de vitória do jogador no mapa selecionado. Os números entre os parenteses representam a quantidade vitórias e partidas totais respectivamente."
                    })
        
                await m.edit({
                    embeds: [embed2]
                })
            })
            .catch((err) => {
                console.log(err);

                DeleteMessage(m);
            })
    } else {
        DeleteMessage(m);
    }
}

module.exports = ranking;