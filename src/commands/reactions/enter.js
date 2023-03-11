const MatchModel = require('../../models/Match');
const PlayerMatchModel = require('../../models/PlayerMatch');

async function enter(client, reaction, user, add) {
    const dm = client.users.cache.get(user.id);

    const match = await MatchModel.findOne({
        message_id: reaction.message.id
    })

    if(!match) {
        dm.send(`A SCRIM que está reagindo foi removida ou já foi sorteada`);
        return;
    }

    if(add) {
        await PlayerMatchModel.create({
            user_id: user.id,
            match_id: match._id
        })
    } else {
        const playerMatch = await PlayerMatchModel.findOne({
            user_id: user.id,
            match_id: match._id
        });

        if(!playerMatch) {
            dm.send(`Você já não participa da SCRIM em que está tentando sair`);
            return;
        }

        await PlayerMatchModel.deleteOne({
            user_id: user.id,
            match_id: match._id
        })
    }
}

module.exports = enter;