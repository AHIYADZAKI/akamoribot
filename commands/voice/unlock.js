const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-unlock')
        .setDescription('Открыть голосовой канал'),
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
                CONNECT: null
            });

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔓 Канал открыт')
                .setDescription(`Канал ${voiceChannel.name} теперь открыт`)
                .setFooter({ text: `Используйте /voice-lock для закрытия` });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при открытии канала', 
                ephemeral: true 
            });
        }
    },
};