const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Камень, ножницы, бумага')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Ваш выбор')
                .setRequired(true)
                .addChoices(
                    { name: 'Камень', value: 'rock' },
                    { name: 'Ножницы', value: 'scissors' },
                    { name: 'Бумага', value: 'paper' }
                )),
    async execute(interaction) {
        const userChoice = interaction.options.getString('choice');
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        const getResult = (user, bot) => {
            if (user === bot) return 'Ничья!';
            if (
                (user === 'rock' && bot === 'scissors') ||
                (user === 'scissors' && bot === 'paper') ||
                (user === 'paper' && bot === 'rock')
            ) return 'Вы победили!';
            return 'Бот победил!';
        };

        const result = getResult(userChoice, botChoice);

        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };

        const embed = new EmbedBuilder()
            .setColor(config.colors.fun)
            .setTitle('Камень 🪨 Ножницы ✂️ Бумага 📄')
            .addFields(
                { name: 'Ваш выбор', value: `${emojis[userChoice]} ${userChoice}`, inline: true },
                { name: 'Выбор бота', value: `${emojis[botChoice]} ${botChoice}`, inline: true },
                { name: 'Результат', value: result }
            );

        await interaction.reply({ embeds: [embed] });
    }
};