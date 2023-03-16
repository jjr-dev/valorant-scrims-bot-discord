const DeleteMessage = require('../helpers/DeleteMessage');

async function teste(client, msg) {
    // Objeto da mensagem
    DeleteMessage(msg);

    // ID da mensagem e objeto do canal
    DeleteMessage(msg.id, msg.channel);

    // ID da mensagem, ID do canal e objeto do client
    DeleteMessage(msg.id, msg.channel.id, client);
}

module.exports = teste;