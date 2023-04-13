const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./configs.json');
const db = require('./db');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Set commands
client.commands = new Collection();

const commands = require('./src/helpers/findcommands.helper');
for(const command of commands()) {
    client.commands.set(command.data.name, command);
}

// Set events
const events = require('./src/helpers/findevents.helper');
for(const event of events()) {
    client[event.once ? 'once' : 'on'](event.name, (...args) => event.execute(...args))
}

// Set cooldowns
client.login(token);

db.connect();
