const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Получить случайное фото кота'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            const cat = response.data[0];

            const embed = new EmbedBuilder()
                .setColor(config.colors.fun)
                .setTitle('🐱 Мяу!')
                .setImage(cat.url);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Не удалось получить фото кота, попробуйте позже',
                ephemeral: true
            });
        }
    }
};