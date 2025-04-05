const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');
const lyricsFinder = require('lyrics-finder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Найти текст песни')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Название песни (оставьте пустым для текущего трека)')
                .setRequired(false)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const serverQueue = musicQueue.get(interaction.guild.id);

        if (!query && (!serverQueue || !serverQueue.songs.length)) {
            return interaction.reply({ 
                content: '❌ Укажите название песни или включите трек!', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        try {
            const searchQuery = query || `${serverQueue.songs[0].title} ${serverQueue.songs[0].requestedBy.username}`;
            const lyrics = await lyricsFinder(searchQuery) || 'Не удалось найти текст песни :(';

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`📝 Текст песни: ${searchQuery}`)
                .setDescription(lyrics.length > 4096 ? lyrics.slice(0, 4093) + '...' : lyrics)
                .setFooter({ text: `Запросил ${interaction.user.tag}` });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.editReply('❌ Произошла ошибка при поиске текста песни');
        }
    },
};