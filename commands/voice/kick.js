const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-kick')
        .setDescription('Выгнать пользователя из голосового канала')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для выгона')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const voiceChannel = interaction.member.voice.channel;
        const targetMember = await interaction.guild.members.fetch(user.id);

        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в голосовом канале!', 
                ephemeral: true 
            });
        }

        if (!voiceChannel.permissionsFor(interaction.user).has('MOVE_MEMBERS')) {
            return interaction.reply({ 
                content: '❌ У вас нет прав для управления каналом!', 
                ephemeral: true 
            });
        }

        if (!targetMember.voice?.channel || targetMember.voice.channel.id !== voiceChannel.id) {
            return interaction.reply({ 
                content: '❌ Пользователь не находится в вашем канале!', 
                ephemeral: true 
            });
        }

        try {
            await targetMember.voice.disconnect();

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('👢 Пользователь выгнан')
                .setDescription(`${user.tag} был выгнан из голосового канала`)
                .setFooter({ text: `Модератор: ${interaction.user.tag}` });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при выгоне пользователя', 
                ephemeral: true 
            });
        }
    },
};