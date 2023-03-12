const MatchModel = require('../../models/Match');
const PlayerMatchModel = require('../../models/PlayerMatch');

async function enter(client, reaction, user, add) {
    const match = await MatchModel.findOne({
        message_id: reaction.message.id
    })

    if(!match)
        return;

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

        if(!playerMatch)
            return;

        await PlayerMatchModel.deleteOne({
            user_id: user.id,
            match_id: match._id
        })
    }
}

module.exports = enter;