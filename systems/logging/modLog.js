const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { formatDate } = require('../../utils/time');

module.exports = async (guild, embed) => {
    try {
        const channel = guild.channels.cache.get(config.channels.modLog);
        if (!channel) return;

        // Добавляем timestamp если его нет
        if (!embed.data.timestamp) {
            embed.setTimestamp();
        }

        await channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Ошибка в modLog:', error);
    }
};

// Дополнительные функции для конкретных типов логов
module.exports.banLog = async (guild, user, moderator, reason) => {
    const embed = new EmbedBuilder()
        .setColor(config.colors.error)
        .setTitle('🔨 Пользователь забанен')
        .addFields(
            { name: 'Пользователь', value: user.tag, inline: true },
            { name: 'ID', value: user.id, inline: true },
            { name: 'Модератор', value: moderator.tag, inline: true },
            { name: 'Причина', value: reason || 'Не указана' }
        )
        .setTimestamp();

    await module.exports(guild, embed);
};

module.exports.warnLog = async (guild, user, moderator, reason) => {
    const embed = new EmbedBuilder()
        .setColor(config.colors.warning)
        .setTitle('⚠ Пользователь получил предупреждение')
        .addFields(
            { name: 'Пользователь', value: user.tag, inline: true },
            { name: 'ID', value: user.id, inline: true },
            { name: 'Модератор', value: moderator.tag, inline: true },
            { name: 'Причина', value: reason || 'Не указана' }
        )
        .setTimestamp();

    await module.exports(guild, embed);
};