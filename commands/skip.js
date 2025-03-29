const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Пропустить текущий трек'),

  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: 'Сейчас ничего не играет!',
        flags: 1 << 6
      });
    }

    const currentTrack = queue.currentTrack;
    queue.node.skip();

    return interaction.reply({
      content: `⏭️ | Пропущено: **${currentTrack.title}**`,
      flags: 1 << 6
    });
  }
};