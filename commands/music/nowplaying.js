const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { musicQueue } = require('../../systems/musicHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Показать текущий трек'),
    async execute(interaction) {
        const serverQueue = musicQueue.get(interaction.guild.id);

        if (!serverQueue || !serverQueue.songs.length) {
            return interaction.reply({ 
                content: '❌ Сейчас ничего не играет!', 
                ephemeral: true 
            });
        }

        const currentSong = serverQueue.songs[0];
        const progress = createProgressBar(serverQueue.player.state.resource.playbackDuration / 1000, currentSong.duration);

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🎶 Сейчас играет')
            .setDescription(`[${currentSong.title}](${currentSong.url})`)
            .addFields(
                { name: 'Длительность', value: `${progress} ${formatDuration(serverQueue.player.state.resource.playbackDuration / 1000)}/${formatDuration(currentSong.duration)}`, inline: false },
                { name: 'Добавил', value: currentSong.requestedBy.username, inline: true },
                { name: 'Громкость', value: `${Math.round(serverQueue.volume * 100)}%`, inline: true }
            )
            .setThumbnail(currentSong.thumbnail)
            .setFooter({ text: `Запросил ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
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

function createProgressBar(current, total) {
    const totalBars = 15;
    const progress = Math.min(current / total, 1);
    const filledBars = Math.round(totalBars * progress);
    return '▬'.repeat(filledBars) + '🔘' + '▬'.repeat(totalBars - filledBars - 1);
}