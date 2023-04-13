const { SlashCommandBuilder } = require('discord.js');

const AutoCompleteHelper = require('../../helpers/autocomplete.helper');
const ValorantHelper = require('../../helpers/valorant.helper')
const EmbedBuilderHelper = require('../../helpers/embedbuilder.helper')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("agente")
        .setDescription("Informações do agente")
        .addStringOption((option) => 
            option.setName('nome')
                .setDescription('Nome do agente')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction) {
        const choices = [
            'Gekko',
            'Fade',
            'Breach',
            'Raze',
            'Chamber',
            'KAY/O',
            'Skye',
            'Cypher',
            'Sova',
            'Killjoy',
            'Harbor',
            'Viper',
            'Phoenix',
            'Astra',
            'Brimstone',
            'Neon',
            'Yoru',
            'Sage',
            'Reyna',
            'Omen',
            'Jett',
            'Sage'
        ];
        
        const options = await AutoCompleteHelper(interaction, choices);
        await interaction.respond(options);
    },
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const name = interaction.options.getString('nome');

        const obj = await ValorantHelper.getAgents({
            language: 'pt-BR',
            playable: true
        });

        if(obj.error) {
            await interaction.editReply(`Erro interno, tente novamente mais tarde`);
            return;
        }

        const agents = obj.data;
        const agent = agents.find(agent => agent.displayName.toLowerCase() == name.toLowerCase());

        if(!agent) {
            await interaction.editReply(`Agente \`${name}\` não encontrado`);
            return;
        }

        const slots = {
            names: {
                Ability1: "Q",
                Ability2: "E",
                Grenade:  "C",
                Ultimate: "X"
            },
            position: ["Q", "E", "C", "X"]
        };
    
        const abilities = [];
        agent.abilities.forEach((ability, index) => {
            let key;
    
            if(slots[ability.slot])
                key = slots.names[ability.slot];
            else
                key = slots.position[index]
    
            abilities.push({
                name: `${key}: ${ability.displayName}`,
                value: ability.description
            })
        })
    
        const client = interaction.client;
        const guild = interaction.guild;

        const emoji = await guild.emojis.cache.find(emoji => emoji.name === `pos_${agent.role.displayName.toLowerCase()}`);

        const embed = EmbedBuilderHelper(client)
            .setTitle(agent.displayName)
            .setDescription(agent.description)
            .setThumbnail(agent.displayIcon)
            .addFields([
                {
                    name: "Função",
                    value: `${emoji} ${agent.role.displayName}`
                },
                ...abilities,
                {
                    name: "Vídeos e dicas:",
                    value: `https://blitz.gg/valorant/agents/${agent.displayName.toLowerCase()}`
                }
            ])

        await interaction.editReply({
            embeds: [embed]
        });
    }
}