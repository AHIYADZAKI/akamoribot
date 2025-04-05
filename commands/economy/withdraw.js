const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Снять деньги с банка')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма для снятия')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        try {
            const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            if (!user || user.bank < amount) {
                return interaction.reply({ 
                    content: '❌ У вас недостаточно средств в банке для снятия',
                    ephemeral: true 
                });
            }

            await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { 
                    $inc: { balance: amount, bank: -amount } 
                }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🏦 Снятие с банка')
                .setDescription(`Вы сняли ${amount} ${config.currency} с банка`)
                .setFooter({ text: `Пользователь: ${interaction.user.username}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при снятии с банка',
                ephemeral: true 
            });
        }
    },
};