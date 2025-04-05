const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Пропустить текущий трек'),
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
                content: '❌ Нет треков для пропуска!', 
                ephemeral: true 
            });
        }

        if (voiceChannel.id !== serverQueue.voiceChannel.id) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в том же голосовом канале, что и бот!', 
                ephemeral: true 
            });
        }

        const currentSong = serverQueue.songs[0];
        serverQueue.player.stop();

        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle('⏭ Трек пропущен')
            .setDescription(`[${currentSong.title}](${currentSong.url})`)
            .setFooter({ text: `Запросил ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
    },
};