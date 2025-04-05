const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Guild = require('../../systems/database/models/Guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-leave')
        .setDescription('Покинуть гильдию'),
    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            const guild = await Guild.findOne({ members: userId });

            if (!guild) {
                return interaction.reply({ 
                    content: '❌ Вы не состоите в гильдии!', 
                    ephemeral: true 
                });
            }

            if (guild.leaderId === userId) {
                return interaction.reply({ 
                    content: '❌ Вы не можете покинуть гильдию, так как являетесь лидером!', 
                    ephemeral: true 
                });
            }

            guild.members = guild.members.filter(member => member !== userId);
            await guild.save();

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`🚪 Вы покинули гильдию ${guild.name}`)
                .setFooter({ text: `Вы можете вступить в другую гильдию с помощью /guild-join` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при выходе из гильдии', 
                ephemeral: true 
            });
        }
    },
};