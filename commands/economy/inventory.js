const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Просмотреть ваш инвентарь')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для просмотра инвентаря')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;

        try {
            const user = await User.findOne({ 
                userId: target.id, 
                guildId: interaction.guild.id 
            });

            if (!user || !user.inventory || user.inventory.length === 0) {
                return interaction.reply({ 
                    content: `🎒 У ${target.username} нет предметов в инвентаре`,
                    ephemeral: true 
                });
            }

            const inventoryList = user.inventory.map((item, index) => 
                `**${index + 1}.** ${item}`
            ).join('\n');

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`🎒 Инвентарь ${target.username}`)
                .setDescription(inventoryList)
                .setFooter({ text: 'Используйте /sell для продажи предметов' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при загрузке инвентаря',
                ephemeral: true 
            });
        }
    },
};