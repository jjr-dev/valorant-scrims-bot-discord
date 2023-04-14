const { SlashCommandBuilder } = require('discord.js');

const PlayerModel = require('../../models/player.model');
const ValorantHelper = require('../../helpers/valorant.helper')
const EmbedBuilderHelper = require('../../helpers/embedbuilder.helper')
const TierHelper = require('../../helpers/tier.helper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vincular")
        .setDescription("Vincular conta")
        .addStringOption(option => 
            option.setName('usuário')
                .setDescription('Nome de usuário da conta')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('tag')
                .setDescription('Tag da conta')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        const username = interaction.options.getString('usuário');
        let tag = interaction.options.getString('tag');

        if(tag[0] === '#')
            tag = tag.substring(1)

        let obj = await ValorantHelper.getAccount({
            username,
            tag
        });

        if(obj.status === 404) {
            await interaction.editReply(`Conta \`${username}#${tag}\` não encontrada`);
            return;
        }

        if(obj.status !== 200) {
            await interaction.editReply(`Erro ao obter conta, tente novamente mais tarde`);
            return;
        }

        const account = obj.data;

        obj = await ValorantHelper.getMMR(account);

        if(obj.status !== 200) {
            await interaction.editReply(`Erro ao obter MMR, tente novamente mais tarde`);
            return;
        }

        const mmr = obj.data;

        const tier = {
            division: null,
            name: null
        }

        if(mmr.elo) {
            const split = mmr.currenttierpatched.split(' ');

            tier.name = TierHelper(split[0]);
            tier.division = split[1] ?? null;
        }

        const guild = interaction.guild;

        guild.members.fetch(interaction.user.id)
            .then(async (member) => {
                const tiers = TierHelper();

                for(const prop in tiers) {
                    const t = tiers[prop];

                    const role = await guild.roles.cache.find((r) => r.name === t);

                    if(role)
                        await member.roles.remove(role.id);
                }

                let role = guild.roles.cache.find((r) => r.name === tier.name);
                
                if(!role)
                    role = await guild.roles.create({
                        name: tier.translated
                    })

                member.roles.add(role.id)
                    .catch((err) => {
                        console.log(err);
                    });

                
                member.setNickname(account.name)
                    .catch((err) => {
                        if(err.code !== 50013)
                            console.log("Erro ao definir apelido", err);
                    })
            })
            .catch((err) => {
                console.log(err);
            })

        await PlayerModel.findOneAndUpdate({
                user_id: interaction.user.id
            }, {
                link_id: account.puuid,
                link_region: account.region,
                link_elo: mmr.elo ? mmr.elo : 0,
                link_date: Date.now()
            }, {
                upsert: true
            });

        const client = interaction.client;
        
        const embed = EmbedBuilderHelper(client)
            .setTitle('Conta vinculada')
            .addFields([
                {
                    name: 'Usuário',
                    value: `${account.name}#${account.tag}`,
                    inline: true
                },
                {
                    name: 'Nível',
                    value: `${account.account_level}`,
                    inline: true
                },
                {
                    name: 'Elo',
                    value: `${mmr.elo ? `${tier.name} ${tier.division}` : "Sem elo"}`,
                    inline: true
                }
            ])
            .setImage(account.card.wide)
            .setThumbnail(mmr.elo ? mmr.images.large : account.card.small)

        await interaction.editReply({
            embeds: [embed]
        });
    }
}