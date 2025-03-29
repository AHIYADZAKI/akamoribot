const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logAction } = require('../utils/logger');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server')
    .addStringOption(option =>
      option.setName('user_id')
        .setDescription('The ID of the user to unban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the unban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    if (!interaction.member.roles.cache.some(r => config.moderatorRoles.includes(r.id))) {
      return interaction.reply({ 
        content: 'You do not have permission to use this command.', 
        ephemeral: true 
      });
    }

    // Получаем и очищаем ID пользователя
    const userId = interaction.options.getString('user_id').replace(/\D/g, '');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Проверка валидности ID
    if (!userId || !/^\d{17,19}$/.test(userId)) {
      return interaction.reply({
        content: '❌ Invalid user ID format. Please provide a valid user ID.',
        ephemeral: true
      });
    }

    try {
      // Разбан пользователя
      await interaction.guild.bans.remove(userId, reason);
      
      // Получаем объект пользователя для логирования
      const user = await interaction.client.users.fetch(userId);
      
      await logAction(interaction.guild, 'Unban', interaction.user, user, reason);
      
      await interaction.reply({ 
        content: `✅ Successfully unbanned user ${user.tag || userId}. Reason: ${reason}`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Unban error:', error);
      
      let errorMessage = '❌ Failed to unban user';
      if (error.code === 50035) {
        errorMessage = '❌ Invalid user ID format';
      } else if (error.code === 10026) {
        errorMessage = '❌ This user is not banned';
      }

      await interaction.reply({ 
        content: errorMessage,
        ephemeral: true
      });
    }
  }
};