const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Получить случайное фото собаки'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://dog.ceo/api/breeds/image/random');
            const dog = response.data;

            const embed = new EmbedBuilder()
                .setColor(config.colors.fun)
                .setTitle('🐶 Гав!')
                .setImage(dog.message);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Не удалось получить фото собаки, попробуйте позже',
                ephemeral: true
            });
        }
    }
};