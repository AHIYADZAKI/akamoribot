const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Продолжить воспроизведение'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: 'Сейчас ничего не играет!',
        flags: 1 << 6
      });
    }

    queue.node.setPaused(false);

    return interaction.reply({
      content: '▶️ | Воспроизведение возобновлено',
      flags: 1 << 6
    });
  }
};