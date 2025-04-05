const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-show')
        .setDescription('Показать голосовой канал'),
    async execute(interaction) {
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
            await voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
                VIEW_CHANNEL: null
            });

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('👁️ Канал отображен')
                .setDescription(`Канал ${voiceChannel.name} теперь виден`)
                .setFooter({ text: `Используйте /voice-hide для скрытия` });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при отображении канала', 
                ephemeral: true 
            });
        }
    },
};