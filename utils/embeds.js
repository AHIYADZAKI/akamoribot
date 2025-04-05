const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    // Базовый embed с настройками из конфига
    baseEmbed: (title, description) => {
        return new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
    },

    // Успешное действие
    successEmbed: (description) => {
        return new EmbedBuilder()
            .setColor(config.colors.success)
            .setDescription(`✅ ${description}`)
            .setTimestamp();
    },

    // Ошибка
    errorEmbed: (description) => {
        return new EmbedBuilder()
            .setColor(config.colors.error)
            .setDescription(`❌ ${description}`)
            .setTimestamp();
    },

    // Предупреждение
    warningEmbed: (description) => {
        return new EmbedBuilder()
            .setColor(config.colors.warning)
            .setDescription(`⚠️ ${description}`)
            .setTimestamp();
    },

    // Информационное сообщение
    infoEmbed: (title, description) => {
        return new EmbedBuilder()
            .setColor(config.colors.info)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
    },

    // Embed для модерации
    modEmbed: (action, user, moderator, reason) => {
        return new EmbedBuilder()
            .setColor(config.colors.moderation)
            .setTitle(`🔨 ${action}`)
            .addFields(
                { name: 'Пользователь', value: user.tag, inline: true },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Модератор', value: moderator.tag, inline: true },
                { name: 'Причина', value: reason || 'Не указана' }
            )
            .setTimestamp();
    }
};