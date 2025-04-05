const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { formatDate } = require('../../utils/time');

module.exports = {
    logChannelCreate: async (channel) => {
        try {
            const logChannel = channel.guild.channels.cache.get(config.channels.serverLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('📝 Канал создан')
                .addFields(
                    { name: 'Название', value: channel.name, inline: true },
                    { name: 'Тип', value: channel.type.toString(), inline: true },
                    { name: 'ID', value: channel.id, inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в channelCreateLog:', error);
        }
    },

    logChannelDelete: async (channel) => {
        try {
            const logChannel = channel.guild.channels.cache.get(config.channels.serverLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('🗑️ Канал удален')
                .addFields(
                    { name: 'Название', value: channel.name, inline: true },
                    { name: 'Тип', value: channel.type.toString(), inline: true },
                    { name: 'ID', value: channel.id, inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в channelDeleteLog:', error);
        }
    },

    logRoleCreate: async (role) => {
        try {
            const logChannel = role.guild.channels.cache.get(config.channels.serverLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🆕 Роль создана')
                .addFields(
                    { name: 'Название', value: role.name, inline: true },
                    { name: 'Цвет', value: role.hexColor, inline: true },
                    { name: 'ID', value: role.id, inline: true }
                )
                .