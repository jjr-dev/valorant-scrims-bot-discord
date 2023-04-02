const PlayerModel = require('../models/Player');

const LinkAccount = require('./LinkAccount');

async function AutoUpdateLinkAccount(client) {
    console.log("Verificando contas desatualizadas");

    let player;

    const pwd = await PlayerModel.findOne({
        link_id: { $ne: null },
        link_date: null
    })

    if(pwd) {
        player = pwd;
    } else {
        const t = new Date();
        t.setDate(t.getDate() - 1);

        player = await PlayerModel.findOne({
            link_id: { $ne: null },
            link_date: {
                $lt: t
            }
        })
    }

    if(!player) {
        console.log("Nenhuma conta desatualizada");
        return;
    }

    const puuid = player.link_id;
    const user  = player.user_id;
    const guild = await client.guilds.fetch('1083825034814050306');

    LinkAccount({ puuid, guild, user })
        .then((res) => {
            const { account } = res;
            
            console.log(`Conta ${account.name}#${account.tag} atualizada`)
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports = AutoUpdateLinkAccount;