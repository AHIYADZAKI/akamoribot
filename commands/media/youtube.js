const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Проверить последнее видео на YouTube')
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('ID или имя канала')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getString('channel');

        try {
            // Здесь должна быть логика проверки YouTube API
            // Это примерная реализация
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('📺 YouTube информация')
                .setDescription(`Проверка канала: ${channel}`)
                .addFields(
                    { name: 'Последнее видео', value: 'Не реализовано', inline: true },
                    { name: 'Подписчики', value: 'Не реализовано', inline: true }
                )
                .setFooter({ text: 'Интеграция с YouTube API не настроена' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Произошла ошибка при проверке YouTube канала',
                ephemeral: true
            });
        }
    }
};