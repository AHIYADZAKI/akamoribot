const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        try {
            const logChannel = channel.guild.channels.cache.get(config.channels.serverLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('Канал удален')
                .addFields(
                    { name: 'Название', value: channel.name },
                    { name: 'Тип', value: channel.type },
                    { name: 'ID', value: channel.id }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в channelDelete:', error);
        }
    }
};