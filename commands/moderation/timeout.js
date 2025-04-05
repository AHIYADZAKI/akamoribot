const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const modLog = require('../../systems/logging/modLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user in the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration in minutes (max 40320)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(40320))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the timeout'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ You do not have permission to timeout members')],
                ephemeral: true
            });
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.timeout(duration * 60 * 1000, reason);
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`✅ Successfully timed out ${user.tag} (${user.id})`)
                .addFields(
                    { name: 'Duration', value: `${duration} minutes` },
                    { name: 'Reason', value: reason }
                )
                .setFooter({ text: `Moderator: ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            await modLog(interaction.guild, interaction.user, 'timeout', user, reason);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ There was an error trying to timeout this user')],
                ephemeral: true
            });
        }
    },
};