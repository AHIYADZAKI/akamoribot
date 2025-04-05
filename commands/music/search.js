const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const ytsr = require('ytsr');
const { musicQueue } = require('../../systems/musicHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Поиск музыки на YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Название трека для поиска')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ 
                content: '❌ Вы должны быть в голосовом канале!', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        try {
            const filters = await ytsr.getFilters(query);
            const filter = filters.get('Type').get('Video');
            const searchResults = await ytsr(filter.url, { limit: 5 });

            if (!searchResults.items.length) {
                return interaction.editReply('❌ Ничего не найдено по вашему запросу');
            }

            const results = searchResults.items.map((item, index) => 
                `**${index + 1}.** [${item.title}](${item.url}) - ${item.duration || 'N/A'}\n`
            ).join('\n');

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`🔍 Результаты поиска: "${query}"`)
                .setDescription(results)
                .setFooter({ text: 'Отправьте номер трека (1-5) для добавления в очередь' });

            await interaction.editReply({ embeds: [embed] });

            const filter = m => m.author.id === interaction.user.id && 
                              ['1', '2', '3', '4', '5'].includes(m.content);
            
            const collector = interaction.channel.createMessageCollector({ 
                filter, 
                time: 15000, 
                max: 1 
            });

            collector.on('collect', async m => {
                const choice = parseInt(m.content) - 1;
                const selected = searchResults.items[choice];

                interaction.followUp({