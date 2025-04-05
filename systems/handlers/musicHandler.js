const { EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const logger = require('../../utils/logger');

module.exports = (client) => {
    client.musicQueue = new Map();

    client.handleMusicQueue = async (guildId, song) => {
        try {
            const queue = client.musicQueue.get(guildId);
            if (!queue) return;

            if (!song) {
                queue.connection.destroy();
                client.musicQueue.delete(guildId);

                const embed = new EmbedBuilder()
                    .setColor(config.colors.info)
                    .setDescription('🎶 Очередь воспроизведения закончилась');

                return queue.textChannel.send({ embeds: [embed] });
            }

            const dispatcher = queue.connection
                .play(song.stream, { type: song.type })
                .on('finish', () => {
                    queue.songs.shift();
                    client.handleMusicQueue(guildId, queue.songs[0]);
                })
                .on('error', error => {
                    logger.error(`❌ Ошибка воспроизведения: ${error}`);
                    queue.songs.shift();
                    client.handleMusicQueue(guildId, queue.songs[0]);
                });

            dispatcher.setVolumeLogarithmic(queue.volume / 100);

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🎶 Сейчас играет')
                .setDescription(`[${song.title}](${song.url})`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    { name: 'Длительность', value: song.duration, inline: true },
                    { name: 'Запросил', value: song.requestedBy.toString(), inline: true }
                );

            queue.textChannel.send({ embeds: [embed] });
        } catch (error) {
            logger.error(`❌ Ошибка обработки очереди: ${error}`);
            client.musicQueue.delete(guildId);
        }
    };
};