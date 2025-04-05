const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Перемешать очередь треков'),
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
                content: '❌ Очередь треков пуста!', 
                ephemeral: true 
            });
        }

        if (voiceChannel.id !== serverQueue.voiceChannel.id) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в том же голосовом канале, что и бот!', 
                ephemeral: true 
            });
        }

        if (serverQueue.songs.length < 3) {
            return interaction.reply({ 
                content: '❌ Для перемешивания нужно минимум 2 трека в очереди!', 
                ephemeral: true 
            });
        }

        // Оставляем текущий трек на месте
        const currentSong = serverQueue.songs.shift();
        const queue = serverQueue.songs;
        
        for (let i = queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }

        serverQueue.songs = [currentSong, ...queue];

        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle('🔀 Очередь перемешана')
            .setDescription(`Перемешано ${queue.length} треков`)
            .setFooter({ text: `Запросил ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
    },
};