require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { YouTubeExtractor, SpotifyExtractor } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

// Инициализация клиента Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

// Инициализация плеера
const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
    filter: 'audioonly'
  },
  smoothVolume: true,
  useLegacyFFmpeg: false
});

// Настройка обработчиков событий плеера
function setupPlayerEvents() {
  player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`🎶 Сейчас играет: **${track.title}**`);
  });

  player.events.on('error', (queue, error) => {
    console.error('Ошибка плеера:', error);
    queue.metadata.channel.send('🔴 Ошибка воспроизведения');
  });
}

// Инициализация экстракторов
async function initializePlayer() {
  try {
    await player.extractors.register(YouTubeExtractor, {});
    await player.extractors.register(SpotifyExtractor, {});
    console.log('✅ YouTube и Spotify экстракторы загружены');
  } catch (error) {
    console.error('❌ Ошибка загрузки экстракторов:', error);
    process.exit(1);
  }
}

// Загрузка команд
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data?.name) {
    client.commands.set(command.data.name, command);
  }
}

// Загрузка событий
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Регистрация команд
async function registerCommands() {
  try {
    const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    if (!process.env.CLIENT_ID || !process.env.GUILD_ID) {
      throw new Error("CLIENT_ID и GUILD_ID должны быть заданы в .env файле");
    }

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID.trim(),
        process.env.GUILD_ID.trim()
      ),
      { body: commands }
    );
    console.log('✅ Слэш-команды успешно зарегистрированы');
  } catch (error) {
    console.error('❌ Ошибка регистрации команд:', error);
  }
}

// Запуск бота
client.once('ready', async () => {
  console.log(`🤖 Бот ${client.user.tag} готов к работе!`);
  await initializePlayer();
  setupPlayerEvents();
  await registerCommands();
});

client.login(process.env.TOKEN).catch(error => {
  console.error('❌ Ошибка входа:', error);
  process.exit(1);
});