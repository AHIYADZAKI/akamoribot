const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const Warn = require('../../systems/database/models/Warn');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('View warnings for a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to view warnings for')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ You do not have permission to view warnings')],
                ephemeral: true
            });
        }

        try {
            const warnings = await Warn.find({ 
                guildId: interaction.guild.id, 
                userId: user.id 
            }).sort({ timestamp: -1 });
            
            if (warnings.length === 0) {
                return interaction.reply({ 
                    embeds: [new EmbedBuilder()
                        .setColor(config.colors.info)
                        .setDescription(`ℹ️ ${user.tag} has no warnings`)],
                    ephemeral: true
                });
            }
            
            const warningList = warnings.map((w, i) => 
                `**#${i+1}** - ${w.reason}\n` +
                `> Moderator: <@${w.moderatorId}>\n` +
                `> Date: <t:${Math.floor(w.timestamp / 1000)}:f>`
            ).join('\n\n');
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle(`⚠️ Warnings for ${user.tag} (${user.id})`)
                .setDescription(warningList)
                .setFooter({ text: `Total warnings: ${warnings.length}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ There was an error trying to fetch warnings')],
                ephemeral: true
            });
        }
    },
};