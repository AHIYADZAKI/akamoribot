const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const modLog = require('../../systems/logging/modLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the kick'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ You do not have permission to kick members')],
                ephemeral: true
            });
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.kick(reason);
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`✅ Successfully kicked ${user.tag} (${user.id})`)
                .addFields({ name: 'Reason', value: reason })
                .setFooter({ text: `Moderator: ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            await modLog(interaction.guild, interaction.user, 'kick', user, reason);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ There was an error trying to kick this user')],
                ephemeral: true
            });
        }
    },
};