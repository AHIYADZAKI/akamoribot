const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Получить случайный мем'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://meme-api.com/gimme');
            const meme = response.data;

            const embed = new EmbedBuilder()
                .setColor(config.colors.fun)
                .setTitle(meme.title)
                .setURL(meme.postLink)
                .setImage(meme.url)
                .setFooter({ text: `👍 ${meme.ups} | r/${meme.subreddit}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Не удалось получить мем, попробуйте позже',
                ephemeral: true
            });
        }
    }
};