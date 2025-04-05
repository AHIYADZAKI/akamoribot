const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Включить/выключить повтор трека')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Режим повтора')
                .addChoices(
                    { name: 'Выключить', value: 'off' },
                    { name: 'Трек', value: 'track' },
                    { name: 'Очередь', value: 'queue' }
                )
                .setRequired(true)),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
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

        serverQueue.loop = mode;

        const modeText = {
            'off': '🔁 Повтор выключен',
            'track': '🔂 Повтор трека',
            'queue': '🔁 Повтор очереди'
        };

        const embed = new EmbedBuilder()
            .setColor(config.colors.success)
            .setTitle(modeText[mode])
            .setFooter({ text: `Запросил ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
    },
};