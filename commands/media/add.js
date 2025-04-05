const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Media = require('../../systems/database/models/Media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('media-add')
        .setDescription('Добавить медиа-канал для отслеживания')
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('Платформа (youtube/twitch)')
                .setRequired(true)
                .addChoices(
                    { name: 'YouTube', value: 'youtube' },
                    { name: 'Twitch', value: 'twitch' }
                ))
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('ID или имя канала')
                .setRequired(true)),
    async execute(interaction) {
        const platform = interaction.options.getString('platform');
        const channel = interaction.options.getString('channel');

        try {
            await Media.create({
                guildId: interaction.guild.id,
                platform,
                channelId: channel,
                lastChecked: new Date()
            });

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`✅ Канал ${channel} добавлен для отслеживания на ${platform}`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Произошла ошибка при добавлении канала',
                ephemeral: true
            });
        }
    }
};