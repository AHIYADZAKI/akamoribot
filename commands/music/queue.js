const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');
const { pagination } = require('../../utils/pagination');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Показать очередь треков'),
    async execute(interaction) {
        const serverQueue = musicQueue.get(interaction.guild.id);

        if (!serverQueue || !serverQueue.songs.length) {
            return interaction.reply({ 
                content: '❌ Очередь треков пуста!', 
                ephemeral: true 
            });
        }

        const itemsPerPage = 10;
        const pages = [];
        const totalPages = Math.ceil(serverQueue.songs.length / itemsPerPage);

        for (let i = 0; i < serverQueue.songs.length; i += itemsPerPage) {
            const queueSlice = serverQueue.songs.slice(i, i + itemsPerPage);
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`🎶 Очередь треков (${serverQueue.songs.length})`)
                .setDescription(
                    queueSlice.map((song, index) => 
                        `**${i + index + 1}.** [${song.title}](${song.url}) - ${formatDuration(song.duration)}\n` +
                        `> Добавил: ${song.requestedBy.username}`
                    ).join('\n\n')
                )
                .setFooter({ text: `Страница ${Math.floor(i / itemsPerPage) + 1}/${totalPages}` });

            pages.push(embed);
        }

        await pagination(interaction, pages);
    },
};

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
        .filter(Boolean)
        .join(':');
}