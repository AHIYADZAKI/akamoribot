const { AudioPlayerStatus } = require('@discordjs/voice');
const { musicQueue } = require('./musicHandler');

module.exports = {
    musicQueue: new Map(),

    initPlayerEvents(guildId) {
        const serverQueue = musicQueue.get(guildId);
        if (!serverQueue) return;

        serverQueue.player.on(AudioPlayerStatus.Idle, () => {
            if (!serverQueue.songs.length) {
                serverQueue.connection.destroy();
                musicQueue.delete(guildId);
                return;
            }

            if (serverQueue.loop === 'track') {
                // Повтор текущего трека
                this.playSong(guildId, serverQueue.songs[0]);
            } else if (serverQueue.loop === 'queue') {
                // Повтор очереди
                const shifted = serverQueue.songs.shift();
                serverQueue.songs.push(shifted);
                this.playSong(guildId, serverQueue.songs[0]);
            } else {
                // Обычное воспроизведение
                serverQueue.songs.shift();
                if (serverQueue.songs.length) {
                    this.playSong(guildId, serverQueue.songs[0]);
                } else {
                    serverQueue.connection.destroy();
                    musicQueue.delete(guildId);
                }
            }
        });

        serverQueue.player.on('error', error => {
            console.error('Ошибка плеера:', error);
            serverQueue.textChannel.send('❌ Произошла ошибка при воспроизведении трека');
        });
    },

    playSong(guildId, song) {
        const serverQueue = musicQueue.get(guildId);
        if (!song) {
            serverQueue.connection.destroy();
            musicQueue.delete(guildId);
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

        serverQueue.textChannel.send({
            embeds: [new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🎶 Сейчас играет')
                .setDescription(`[${song.title}](${song.url})`)
                .addFields(
                    { name: 'Длительность', value: song.duration || 'N/A', inline: true },
                    { name: 'Добавил', value: song.requestedBy.username, inline: true }
                )
                .setThumbnail(song.thumbnail)
            ]
        });
    }
};