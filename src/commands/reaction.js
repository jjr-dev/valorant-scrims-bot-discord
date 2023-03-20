const listPlayers = require('./reactions/listPlayers');
const sortPlayers = require('./reactions/sortPlayers');
const sortMap     = require('./reactions/sortMap');
const play        = require('./reactions/play');
const enter       = require('./reactions/enter');
const resultMatch = require('./reactions/resultMatch');

async function reaction(client, reaction, user, add) {
    if(user.bot)
        return;
        
    const emoji = reaction._emoji.name || reaction._emoji.id;

    let isBotMsg = false;
    await reaction.message.channel.messages.fetch(reaction.message.id)
        .then((msg) => {
            const author = msg.author;

            if(author.id === '1083813927877627955')
                isBotMsg = true;
        });

    if(!isBotMsg)
        return;

    switch(emoji) {
        case "✅":
            enter(client, reaction, user, add);
            break;
        case "📃":
            listPlayers(client, reaction, user, add);
            break;
        case "🎲":
            sortPlayers(client, reaction, user, add);
            break;
        case "🗺️":
            sortMap(client, reaction, user, add);
            break;
        case "▶️":
            play(client, reaction, user, add);
            break;
        case "🅰️":
            resultMatch(true, client, reaction, user, add);
            break;
        case "🅱️":
            resultMatch(false, client, reaction, user, add);
            break;
        default:
            if(!add)
                return;
            
            reaction.remove()
                .catch((err) => {
                    if(err.status !== 404)
                        console.log(err);
                });
            break;
    }
}

module.exports = reaction;