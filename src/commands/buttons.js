const { EmbedBuilder } = require('discord.js');

const SortMap = require('../helpers/SortMap');

async function buttons(client, interaction) {
    if(!interaction.isButton()) return;
    if(interaction.message.author.id !== '1083819033247358987') return;

    const id = interaction.customId;

    if(id === 'sort-match-map') {
        await interaction.deferReply();

        try {
            const map = await SortMap();

            console.log(interaction);
    
            const embed = new EmbedBuilder()
                .setColor("Random")
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle('Mapa sorteado')
                .setDescription(`O membro ${interaction.user} sorteou o mapa **${map.displayName}**`)
                .setThumbnail(map.displayIcon)
                .setImage(map.splash)

            await interaction.editReply({
                embeds: [embed]
            })
        } catch(err) {
            console.log(err);
            interaction.deleteReply();
        }
    }
}

module.exports = buttons;