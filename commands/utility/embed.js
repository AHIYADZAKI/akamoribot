const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Создать встроенное сообщение')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Заголовок Embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Описание Embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Цвет в HEX (например, #FF0000)')
                .setRequired(false)),
    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('color') || config.colors.primary;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter({ text: `Создано ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};