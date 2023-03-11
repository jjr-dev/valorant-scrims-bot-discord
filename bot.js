const fs   = require('fs');
const path = require('path');

const { Client, GatewayIntentBits, Partials, Events, ChannelType } = require('discord.js');
const { token, prefix } = require('./configs.json');

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Message,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.User,
        Partials.Channel
    ]
});

let commands = {};

client.on(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
})

const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command  = require(filePath);

    commands[file.slice(0, -3)] = command;
}

client.on(Events.MessageCreate, async (msg) => {
    if(msg.author.bot || msg.channel.type === ChannelType.DM)
        return;

    const msgPrefix = msg.content.slice(0, prefix.length);

    if(msgPrefix !== prefix)
        return;

    const args    = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    commands[command].call(this, client, msg, args);
})

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    commands['reaction'].call(this, client, reaction, user, true);
})

client.on(Events.MessageReactionRemove, async (reaction, user) => {
    commands['reaction'].call(this, client, reaction, user, false);
})

client.on(Events.VoiceStateUpdate, async (oldChannel, newCannel) => {
    commands['voice'].call(this, client, oldChannel, newCannel);
})

const database = require('./db');
database();

client.login(token);