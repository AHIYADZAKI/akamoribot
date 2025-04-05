const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Media = require('../../systems/database/models/Media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('media-notify')
        .setDescription('Настроить уведомления для медиа-каналов')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Канал для уведомлений')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Роль для упоминания (необязательно)')
                .setRequired(false)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');

        try {
            await Media.updateMany(
                { guildId: interaction.guild.id },
                { $set: { notificationChannel: channel.id, mentionRole: role?.id } }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(
                    `✅ Уведомления настроены в канале ${channel}` +
                    (role ? ` с упоминанием роли ${role}` : '')
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Произошла ошибка при настройке уведомлений',
                ephemeral: true
            });
        }
    }
};