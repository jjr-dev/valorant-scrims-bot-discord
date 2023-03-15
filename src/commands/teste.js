const { EmbedBuilder } = require('discord.js');

async function teste(client, msg) {
    const embed1 = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL()
        })
        .setTitle('Partida iniciada')
        .setDescription(`O membro iniciou a partida`)
        .addFields(
            {
                name: "Mapa",
                value: "MAPA"
            },
            {
                name: "🅰️ - Atacantes",
                value: "LISTA",
                inline: true
            },
            {
                name: "🅱️ - Defensores",
                value: "LISTA",
                inline: true
            },
            {
                name: "Como registrar o resultado",
                value: `
                    Vote em 🅰️ ou 🅱️ para registrar o resultado da partida. 
                    
                    **Avisos:**
                    • Apenas os capitães (🎖️) podem registrar o resultado
                    • O resultado é registrado apenas quando ambos votarem
                `
            }
        )

    const m = await msg.channel.send({
        embeds: [embed1]
    });
}

module.exports = teste;