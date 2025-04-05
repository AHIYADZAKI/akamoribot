const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { formatDate } = require('../../utils/time');

module.exports = {
    logMemberJoin: async (member) => {
        try {
            const channel = member.guild.channels.cache.get(config.channels.memberLog);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('➕ Новый участник')
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'Пользователь', value: member.user.tag, inline: true },
                    { name: 'ID', value: member.user.id, inline: true },
                    { name: 'Аккаунт создан', value: formatDate(member.user.createdAt), inline: true },
                    { name: 'Участников', value: member.guild.memberCount.toString(), inline: true }
                )
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в memberJoinLog:', error);
        }
    },

    logMemberLeave: async (member) => {
        try {
            const channel = member.guild.channels.cache.get(config.channels.memberLog);
            if (!channel) return;

            const roles = member.roles.cache
                .filter(role => role.id !== member.guild.id)
                .map(role => role.toString())
                .join(', ') || 'Нет ролей';

            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('➖ Участник вышел')
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'Пользователь', value: member.user.tag, inline: true },
                    { name: 'ID', value: member.user.id, inline: true },
                    { name: 'Присоединился', value: formatDate(member.joinedAt), inline: true },
                    { name: 'Роли', value: roles.slice(0, 1024) },
                    { name: 'Участников', value: member.guild.memberCount.toString(), inline: true }
                )
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в memberLeaveLog:', error);
        }
    },

    logMemberUpdate: async (oldMember, newMember) => {
        try {
            const channel = newMember.guild.channels.cache.get(config.channels.memberLog);
            if (!channel) return;

            // Логирование изменения никнейма
            if (oldMember.nickname !== newMember.nickname) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.warning)
                    .setTitle('✏️ Изменение никнейма')
                    .addFields(
                        { name: 'Пользователь', value: newMember.user.tag, inline: true },
                        { name: 'Старый ник', value: oldMember.nickname || 'Не установлен', inline: true },
                        { name: 'Новый ник', value: newMember.nickname || 'Не установлен', inline: true }
                    )
                    .setFooter({ text: `ID: ${newMember.user.id}` })
                    .setTimestamp();

                await channel.send({ embeds: [embed] });
            }

            // Логирование изменения ролей
            const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
            const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

            if (addedRoles.size > 0 || removedRoles.size > 0) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.info)
                    .setTitle('🔄 Обновление ролей')
                    .setDescription(`Пользователь: ${newMember.user.tag}`);

                if (addedRoles.size > 0) {
                    embed.addFields({
                        name: 'Добавлены роли',
                        value: addedRoles.map(r => r.toString()).join(', '),
                        inline: true
                    });
                }

                if (removedRoles.size > 0) {
                    embed.addFields({
                        name: 'Удалены роли',
                        value: removedRoles.map(r => r.toString()).join(', '),
                        inline: true
                    });
                }

                embed.setFooter({ text: `ID: ${newMember.user.id}` })
                     .setTimestamp();

                await channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Ошибка в memberUpdateLog:', error);
        }
    }
};