const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Продать предмет из инвентаря')
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Название предмета для продажи')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('price')
                .setDescription('Цена продажи')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction) {
        const itemName = interaction.options.getString('item');
        const price = interaction.options.getInteger('price');

        try {
            // Здесь должна быть проверка наличия предмета у пользователя
            // Например, если у вас есть инвентарь в базе данных:
            // const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            // if (!user.inventory.includes(itemName)) {
            //     return interaction.reply({ 
            //         content: '❌ У вас нет этого предмета',
            //         ephemeral: true 
            //     });
            // }

            // Удаляем предмет из инвентаря и добавляем деньги
            await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { 
                    $inc: { balance: price },
                    $pull: { inventory: itemName } 
                }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('💰 Предмет продан')
                .setDescription(`Вы продали **${itemName}** за ${price} ${config.currency}`)
                .setFooter({ text: `Продавец: ${interaction.user.username}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при продаже предмета',
                ephemeral: true 
            });
        }
    },
};