const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'roleDelete',
    async execute(role) {
        try {
            const logChannel = role.guild.channels.cache.get(config.channels.serverLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('Роль удалена')
                .addFields(
                    { name: 'Название', value: role.name },
                    { name: 'Цвет', value: role.hexColor },
                    { name: 'ID', value: role.id }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в roleDelete:', error);
        }
    }
};