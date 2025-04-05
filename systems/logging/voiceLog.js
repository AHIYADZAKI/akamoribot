const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { formatDuration } = require('../../utils/time');

module.exports = {
    logVoiceJoin: async (member, channel) => {
        try {
            const logChannel = member.guild.channels.cache.get(config.channels.voiceLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔊 Вход в голосовой канал')
                .addFields(
                    { name: 'Пользователь', value: member.user.tag, inline: true },
                    { name: 'Канал', value: channel.toString(), inline: true }
                )
                .setFooter({ text: `ID: ${member.user.id}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в voiceJoinLog:', error);
        }
    },

    logVoiceLeave: async (member, channel) => {
        try {
            const logChannel = member.guild.channels.cache.get(config.channels.voiceLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('🔇 Выход из голосового канала')
                .addFields(
                    { name: 'Пользователь', value: member.user.tag, inline: true },
                    { name: 'Канал', value: channel.toString(), inline: true }
                )
                .setFooter({ text: `ID: ${member.user.id}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в voiceLeaveLog:', error);
        }
    },

    logVoiceMove: async (member, oldChannel, newChannel) => {
        try {
            const logChannel = member.guild.channels.cache.get(config.channels.voiceLog);
            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.info)
                .setTitle('🔀 Перемещение по голосовым каналам')
                .addFields(
                    { name: 'Пользователь', value: member.user.tag, inline: true },
                    { name: 'Из канала', value: oldChannel.toString(), inline: true },
                    { name: 'В канал', value: newChannel.toString(), inline: true }
                )
                .setFooter({ text: `ID: ${member.user.id}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в voiceMoveLog:', error);
        }
    }
};