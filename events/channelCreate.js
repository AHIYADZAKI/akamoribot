const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'channelCreate',
    async execute(channel) {
        try {
            const logChannel = channel.guild.channels.cache.get(config.channels.serverLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('Канал создан')
                .addFields(
                    { name: 'Название', value: channel.name },
                    { name: 'Тип', value: channel.type },
                    { name: 'ID', value: channel.id }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в channelCreate:', error);
        }
    }
};