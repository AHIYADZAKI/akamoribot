const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const translate = require('@vitalets/google-translate-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Перевести текст')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Текст для перевода')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('Язык перевода (код, например en, ru)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('Исходный язык (код, например auto, en, ru)')
                .setRequired(false)),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const to = interaction.options.getString('to') || 'ru';
        const from = interaction.options.getString('from') || 'auto';

        try {
            const result = await translate(text, { to, from });

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🌍 Переводчик')
                .addFields(
                    { name: 'Исходный текст', value: text.length > 1024 ? text.slice(0, 1021) + '...' : text },
                    { name: 'Перевод', value: result.text.length > 1024 ? result.text.slice(0, 1021) + '...' : result.text },
                    { name: 'Языки', value: `Из: ${result.from.language.iso}\nВ: ${to}` }
                )
                .setFooter({ text: `Запрошено ${interaction.user.tag}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при переводе', 
                ephemeral: true 
            });
        }
    },
};