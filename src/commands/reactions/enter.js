const MatchModel = require('../../models/Match');
const PlayerMatchModel = require('../../models/PlayerMatch');
const PlayerModel = require('../../models/Player');

const RemoveReaction = require('../../helpers/RemoveReaction');

async function enter(client, reaction, user, add) {
    const match = await MatchModel.findOne({
        message_id: reaction.message.id
    })

    if(!match)
        return;

    if(add) {
        const player = await PlayerModel.findOne({
            user_id: user.id
        })

        if(!player.link_elo) {
            RemoveReaction(reaction, user);
            return;
        }

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