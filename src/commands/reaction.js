const enter = require('./reactions/enter');
const sortPlayers = require('./reactions/sortPlayers');
const sortMap = require('./reactions/sortMap');
const play = require('./reactions/play');

async function reaction(client, reaction, user, add) {
    if(user.bot)
        return;

    const emoji = reaction._emoji.name || reaction._emoji.id;

    switch(emoji) {
        case "✅":
            enter(client, reaction, user, add);
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
    }
}

module.exports = reaction;