const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-lock')
        .setDescription('Закрыть голосовой канал'),
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
                CONNECT: false
            });

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔒 Канал закрыт')
                .setDescription(`Канал ${voiceChannel.name} теперь закрыт`)
                .setFooter({ text: `Используйте /voice-unlock для открытия` });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при закрытии канала', 
                ephemeral: true 
            });
        }
    },
};