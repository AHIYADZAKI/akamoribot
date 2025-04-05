const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-limit')
        .setDescription('Установить лимит пользователей в канале')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Количество пользователей (0 - без лимита)')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(99)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в голосовом канале!', 
                ephemeral: true 
            });
        }

        if (!voiceChannel.permissionsFor(interaction.user).has('MANAGE_CHANNELS')) {
            return interaction.reply({ 
                content: '❌ Вы не управляете этим каналом!', 
                ephemeral: true 
            });
        }

        try {
            await voiceChannel.setUserLimit(amount);

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔢 Лимит пользователей установлен')
                .setDescription(`Лимит канала ${voiceChannel.name} изменен`)
                .addFields(
                    { name: 'Новый лимит', value: amount === 0 ? 'Без лимита' : amount.toString(), inline: true }
                )
                .setFooter({ text: `Изменено ${interaction.user.tag}` });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при изменении лимита', 
                ephemeral: true 
            });
        }
    },
};