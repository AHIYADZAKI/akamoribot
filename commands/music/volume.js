const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Изменить громкость (0-200)')
        .addIntegerOption(option =>
            option.setName('value')
                .setDescription('Значение громкости')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(200)),
    async execute(interaction) {
        const volume = interaction.options.getInteger('value');
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

        serverQueue.volume = volume / 100;
        serverQueue.player.state.resource.volume.setVolume(serverQueue.volume);

        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle('🔊 Громкость изменена')
            .setDescription(`Установлена громкость: ${volume}%`)
            .setFooter({ text: `Запросил ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
    },
};