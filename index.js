const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./utils/logger');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember
    ],
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    }
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.snipes = new Map();
client.editsnipes = new Map();
client.voiceGenerator = new Map();
client.guildData = new Map();
client.mediaCheck = new Map();

['command', 'event', 'button', 'selectMenu', 'modal', 'error', 'music'].forEach(handler => {
    require(`./systems/handlers/${handler}Handler`)(client);
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('Connected to MongoDB');
}).catch(err => {
    logger.error('Database connection error:', err);
});

process.on('unhandledRejection', err => {
    logger.error('Unhandled promise rejection:', err);
});

process.on('uncaughtException', err => {
    logger.error('Uncaught exception:', err);
});

client.login(config.token).catch(err => {
    logger.error('Login error:', err);
    process.exit(1);
});

module.exports = client;