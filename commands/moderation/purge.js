const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const modLog = require('../../systems/logging/modLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete a number of messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Only delete messages from this user')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for purging messages')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ You do not have permission to manage messages')],
                ephemeral: true
            });
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            let filteredMessages = messages;
            
            if (target) {
                filteredMessages = messages.filter(m => m.author.id === target.id);
            }
            
            await interaction.channel.bulkDelete(filteredMessages, true);
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`✅ Deleted ${filteredMessages.size} messages${target ? ` from ${target.tag}` : ''}`)
                .addFields({ name: 'Reason', value: reason })
                .setFooter({ text: `Moderator: ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            
            // Log the purge action
            await modLog(
                interaction.guild, 
                interaction.user, 
                'purge', 
                null, 
                `Deleted ${filteredMessages.size} messages in ${interaction.channel}\nReason: ${reason}`
            );
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ There was an error trying to purge messages')],
                ephemeral: true
            });
        }
    },
};