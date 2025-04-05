const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('howgay')
        .setDescription('Измеряет уровень "гейности"')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для проверки')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const percentage = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
            .setColor(config.colors.fun)
            .setDescription(`🌈 ${user} на ${percentage}% гей`);

        await interaction.reply({ embeds: [embed] });
    }
};