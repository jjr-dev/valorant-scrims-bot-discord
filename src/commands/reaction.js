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
    }
}

module.exports = reaction;