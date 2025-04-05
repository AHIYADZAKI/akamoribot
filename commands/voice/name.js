const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-name')
        .setDescription('Изменить название голосового канала')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Новое название канала')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
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
            await voiceChannel.setName(name);

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✏️ Название изменено')
                .setDescription(`Новое название канала: ${name}`)
                .setFooter({ text: `Изменено ${interaction.user.tag}` });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при изменении названия', 
                ephemeral: true 
            });
        }
    },
};