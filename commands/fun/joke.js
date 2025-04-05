const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Получить случайную шутку'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://v2.jokeapi.dev/joke/Any?lang=ru');
            const joke = response.data;

            const embed = new EmbedBuilder()
                .setColor(config.colors.fun)
                .setTitle('🎭 Случайная шутка');

            if (joke.type === 'single') {
                embed.setDescription(joke.joke);
            } else {
                embed.addFields(
                    { name: 'Вопрос', value: joke.setup },
                    { name: 'Ответ', value: joke.delivery }
                );
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Не удалось получить шутку, попробуйте позже',
                ephemeral: true
            });
        }
    }
};