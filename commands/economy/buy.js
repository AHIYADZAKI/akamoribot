const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../systems/database/models');
const { ShopItem, User } = require('../../systems/database/models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Купить товар из магазина')
        .addStringOption(option =>
            option.setName('item_id')
                .setDescription('ID товара для покупки')
                .setRequired(true)),
    async execute(interaction) {
        const itemId = interaction.options.getString('item_id');

        try {
            const item = await ShopItem.findById(itemId);
            if (!item) {
                return interaction.reply({ 
                    content: '❌ Товар с таким ID не найден',
                    ephemeral: true 
                });
            }

            const user = await User.findOne({ 
                userId: interaction.user.id, 
                guildId: interaction.guild.id 
            });

            if (!user || user.balance < item.price) {
                return interaction.reply({ 
                    content: `❌ У вас недостаточно средств для покупки (Цена: ${item.price} ${config.currency})`,
                    ephemeral: true 
                });
            }

            await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { $inc: { balance: -item.price } }
            );

            // Здесь должна быть логика выдачи товара (роли и т.д.)
            // Например, если это роль:
            // const member = await interaction.guild.members.fetch(interaction.user.id);
            // await member.roles.add(item.roleId);

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🛒 Покупка совершена')
                .setDescription(`Вы купили **${item.name}** за ${item.price} ${config.currency}`)
                .addFields(
                    { name: 'Описание', value: item.description }
                )
                .setFooter({ text: `Покупатель: ${interaction.user.username}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при покупке товара',
                ephemeral: true 
            });
        }
    },
};