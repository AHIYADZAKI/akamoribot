const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Проверить задержку бота'),
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: '🏓 Измерение задержки...', 
            fetchReply: true 
        });
        
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        const apiPing = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🏓 Понг!')
            .addFields(
                { name: 'Задержка бота', value: `${ping}мс`, inline: true },
                { name: 'API задержка', value: `${apiPing}мс`, inline: true }
            )
            .setFooter({ text: `Версия ${config.version}` });

        await interaction.editReply({ 
            content: '',
            embeds: [embed] 
        });
    },
};