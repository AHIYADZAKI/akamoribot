const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Воспроизвести музыку с YouTube, Spotify и других платформ')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Название трека или URL')
        .setRequired(true)),

  async execute(interaction) {
    // 1. Проверка голосового канала
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: '❌ Вы должны находиться в голосовом канале!',
        flags: 1 << 6,
        ephemeral: true
      }).catch(console.error);
    }

    // 2. Отложенный ответ (увеличивает время обработки до 15 минут)
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: false });
    }

    const player = useMainPlayer();
    const query = interaction.options.getString('query');
    const channel = interaction.member.voice.channel;

    try {
      // 3. Проверка URL YouTube
      if (query.includes('youtube.com') || query.includes('youtu.be')) {
        if (!await ytdl.validateURL(query)) {
          return interaction.followUp({
            content: '❌ Некорректная ссылка YouTube',
            flags: 1 << 6
          }).catch(console.error);
        }
      }

      // 4. Поиск трека
      const searchResult = await player.search(query, {
        requestedBy: interaction.user,
        searchEngine: query.startsWith('http') ? 'auto' : 'youtube',
        fallbackSearchEngine: 'youtube',
        youtubeOptions: {
          useAPI: true // Используем официальный API вместо скрейпинга
        }
      });

      // 5. Проверка результатов
      if (!searchResult.hasTracks()) {
        return interaction.followUp({
          content: '❌ Ничего не найдено. Попробуйте другой запрос',
          flags: 1 << 6
        }).catch(console.error);
      }

      // 6. Воспроизведение
      const { track } = await player.play(channel, searchResult, {
        nodeOptions: {
          metadata: {
            interaction, // Для обработчиков событий
            channel: interaction.channel,
            client: interaction.client
          },
          volume: 60,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 30000,
          leaveOnEnd: false,
          bufferingTimeout: 30000,
          preferBridgedMetadata: true,
          maxSize: 50,
          maxHistorySize: 50,
          ffmpegOptions: {
            beforeOptions: [
              '-reconnect', '1',
              '-reconnect_streamed', '1',
              '-reconnect_delay_max', '5'
            ],
            options: [
              '-vn',
              '-bufsize', '96k',
              '-af', 'dynaudnorm=f=150:g=15'
            ]
          }
        }
      });

      // 7. Отправка красивого embed
      const embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('🎶 Сейчас играет')
        .setDescription(`[${track.title}](${track.url})`)
        .setThumbnail(track.thumbnail)
        .addFields(
          { name: 'Длительность', value: track.duration, inline: true },
          { name: 'Запросил', value: track.requestedBy.toString(), inline: true }
        );

      await interaction.followUp({ 
        embeds: [embed],
        flags: 1 << 6
      }).catch(console.error);

    } catch (error) {
      console.error('Play command error:', error);
      
      // 8. Обработка ошибок с проверкой состояния взаимодействия
      const errorMessage = error.message.includes('age restricted') 
        ? '❌ Видео с возрастными ограничениями не поддерживаются'
        : '❌ Ошибка при воспроизведении: ' + error.message;

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: errorMessage,
          flags: 1 << 6
        }).catch(console.error);
      } else {
        await interaction.reply({
          content: errorMessage,
          flags: 1 << 6,
          ephemeral: true
        }).catch(console.error);
      }
    }
  }
};