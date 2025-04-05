const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('Оценить что-либо')
        .addStringOption(option =>
            option.setName('thing')
                .setDescription('Что оцениваем')
                .setRequired(true)),
    async execute(interaction) {
        const thing = interaction.options.getString('thing');
        const rating = Math.floor(Math.random() * 10) + 1;
        const stars = '⭐'.repeat(rating) + '☆'.repeat(10 - rating);

        const embed = new EmbedBuilder()
            .setColor(config.colors.fun)
            .setDescription(`Я оцениваю **${thing}** на ${rating}/10\n${stars}`);

        await interaction.reply({ embeds: [embed] });
    }
};