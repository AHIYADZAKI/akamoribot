const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Продолжить воспроизведение'),
    async execute(interaction) {
        const serverQueue = musicQueue.get(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в голосовом канале!', 
                ephemeral: true 
            });
        }

        if (!serverQueue) {
            return interaction.reply({ 
                content: '❌ Нет активного воспроизведения!', 
                ephemeral: true 
            });
        }

        if (voiceChannel.id !== serverQueue.voiceChannel.id) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в том же голосовом канале, что и бот!', 
                ephemeral: true 
            });
        }

        if (serverQueue.player.state.status !== 'paused') {
            return interaction.reply({ 
                content: '❌ Воспроизведение не на паузе!', 
                ephemeral: true 
            });
        }

        serverQueue.player.unpause();

        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle('▶ Воспроизведение продолжено')
            .setFooter({ text: `Запросил ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
    },
};