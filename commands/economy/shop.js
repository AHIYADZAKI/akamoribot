const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const ShopItem = require('../../systems/database/models/ShopItem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Просмотреть доступные товары в магазине'),
    async execute(interaction) {
        try {
            const items = await ShopItem.find({ guildId: interaction.guild.id });
            if (items.length === 0) {
                return interaction.reply({ 
                    content: '🛒 В магазине пока нет товаров',
                    ephemeral: true 
                });
            }

            const shopList = items.map(item => 
                `**${item.name}** - ${item.price} ${config.currency}\n` +
                `> ${item.description}\n` +
                `> ID: ${item._id}`
            ).join('\n\n');

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🛍️ Магазин сервера')
                .setDescription(shopList)
                .setFooter({ text: 'Используйте /buy [ID] для покупки' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при загрузке магазина',
                ephemeral: true 
            });
        }
    },
};