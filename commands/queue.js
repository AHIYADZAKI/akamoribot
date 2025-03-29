const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Показать текущую очередь треков'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: 'Сейчас ничего не играет!',
        flags: 1 << 6
      });
    }

    const tracks = queue.tracks.toArray();
    const currentTrack = queue.currentTrack;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎶 Очередь воспроизведения')
      .setDescription(`**Сейчас играет:** [${currentTrack.title}](${currentTrack.url})`)
      .addFields(
        {
          name: 'Очередь',
          value: tracks.length > 0 
            ? tracks.slice(0, 10).map((track, i) => `${i + 1}. [${track.title}](${track.url})`).join('\n')
            : 'Очередь пуста',
          inline: false
        },
        {
          name: 'Всего треков',
          value: `${tracks.length + 1}`,
          inline: true
        }
      );

    return interaction.reply({ embeds: [embed] });
  }
};