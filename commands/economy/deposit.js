const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Положить деньги в банк')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма для пополнения')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        try {
            const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            if (!user || user.balance < amount) {
                return interaction.reply({ 
                    content: '❌ У вас недостаточно средств для пополнения',
                    ephemeral: true 
                });
            }

            await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { 
                    $inc: { balance: -amount, bank: amount } 
                }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🏦 Пополнение банка')
                .setDescription(`Вы положили ${amount} ${config.currency} в банк`)
                .setFooter({ text: `Пользователь: ${interaction.user.username}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при пополнении банка',
                ephemeral: true 
            });
        }
    },
};