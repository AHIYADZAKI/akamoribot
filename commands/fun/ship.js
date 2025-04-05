const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Проверить совместимость двух пользователей')
        .addUserOption(option =>
            option.setName('user1')
                .setDescription('Первый пользователь')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user2')
                .setDescription('Второй пользователь')
                .setRequired(true)),
    async execute(interaction) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');
        const percentage = Math.floor(Math.random() * 101);
        
        let status;
        if (percentage < 30) status = 'Плохая совместимость 😢';
        else if (percentage < 70) status = 'Неплохо! 😊';
        else status = 'Идеальная пара! 💖';

        const embed = new EmbedBuilder()
            .setColor(config.colors.fun)
            .setTitle('💘 Проверка совместимости')
            .setDescription(`${user1.username} ❤️ ${user2.username}`)
            .addFields(
                { name: 'Совместимость', value: `${percentage}%` },
                { name: 'Статус', value: status }
            );

        await interaction.reply({ embeds: [embed] });
    }
};