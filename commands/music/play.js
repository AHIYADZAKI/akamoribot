const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Воспроизвести музыку')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Название или URL трека')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в голосовом канале!', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        try {
            // Проверяем, является ли запрос URL YouTube
            let videoInfo;
            if (ytdl.validateURL(query)) {
                videoInfo = await ytdl.getInfo(query);
            } else {
                // Поиск по запросу
                const searchResults = await ytsr(query, { limit: 1 });
                if (!searchResults.items.length) {
                    return interaction.editReply('❌ Ничего не найдено по вашему запросу');
                }
                videoInfo = await ytdl.getInfo(searchResults.items[0].url);
            }

            const song = {
                title: videoInfo.videoDetails.title,
                url: videoInfo.videoDetails.video_url,
                duration: videoInfo.videoDetails.lengthSeconds,
                thumbnail: videoInfo.videoDetails.thumbnails[0].url,
                requestedBy: interaction.user
            };

            const serverQueue = musicQueue.get(interaction.guild.id);
            if (!serverQueue) {
                // Создаем новую очередь
                const queueConstruct = {
                    textChannel: interaction.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    player: createAudioPlayer(),
                    songs: [],
                    volume: 1,
                    playing: true
                };

                musicQueue.set(interaction.guild.id, queueConstruct);
                queueConstruct.songs.push(song);

                try {
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });

                    queueConstruct.connection = connection;
                    playSong(interaction.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(error);
                    musicQueue.delete(interaction.guild.id);
                    return interaction.editReply('❌ Не удалось подключиться к голосовому каналу!');
                }
            } else {
                serverQueue.songs.push(song);
                const embed = new EmbedBuilder()
                    .setColor(config.colors.success)
                    .setTitle('🎵 Трек добавлен в очередь')
                    .setDescription(`[${song.title}](${song.url})`)
                    .addFields(
                        { name: 'Длительность', value: formatDuration(song.duration), inline: true },
                        { name: 'Добавил', value: song.requestedBy.username, inline: true }
                    )
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Позиция в очереди: ${serverQueue.songs.length}` });

                return interaction.editReply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🎶 Сейчас играет')
                .setDescription(`[${song.title}](${song.url})`)
                .addFields(
                    { name: 'Длительность', value: formatDuration(song.duration), inline: true },
                    { name: 'Добавил', value: song.requestedBy.username, inline: true }
                )
                .setThumbnail(song.thumbnail);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.editReply('❌ Произошла ошибка при воспроизведении трека');
        }
    },
};

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
        .filter(Boolean)
        .join(':');
}

async function playSong(guild, song) {
    const serverQueue = musicQueue.get(guild.id);
    if (!song) {
        serverQueue.connection.destroy();
        musicQueue.delete(guild.id);
        return;
    }

    const stream = ytdl(song.url, { 
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25 
    });

    const resource = createAudioResource(stream);
    serverQueue.player.play(resource);
    serverQueue.connection.subscribe(serverQueue.player);

    serverQueue.player.on('error', error => {
        console.error('Ошибка плеера:', error);
        serverQueue.textChannel.send('❌ Произошла ошибка при воспроизведении трека');
    });

    serverQueue.player.on('stateChange', (oldState, newState) => {
        if (newState.status === 'idle') {
            serverQueue.songs.shift();
            playSong(guild, serverQueue.songs[0]);
        }
    });
}