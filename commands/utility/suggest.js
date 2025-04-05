const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Отправить предложение')
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('Ваше предложение')
                .setRequired(true)),
    async execute(interaction) {
        const suggestion = interaction.options.getString('suggestion');

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`💡 Предложение от ${interaction.user.username}`)
            .setDescription(suggestion)
            .setFooter({ text: 'Голосуйте реакциями ниже!' })
            .setTimestamp();

        const message = await interaction.reply({ 
            embeds: [embed], 
            fetchReply: true 
        });

        await message.react('👍');
        await message.react('👎');
    },
};