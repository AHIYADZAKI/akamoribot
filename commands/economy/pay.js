const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Перевести деньги другому пользователю')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для перевода')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма для перевода')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (target.id === interaction.user.id) {
            return interaction.reply({ 
                content: '❌ Вы не можете перевести деньги себе',
                ephemeral: true 
            });
        }

        try {
            const sender = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            if (!sender || sender.balance < amount) {
                return interaction.reply({ 
                    content: '❌ У вас недостаточно средств для перевода',
                    ephemeral: true 
                });
            }

            await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { $inc: { balance: -amount } }
            );

            await User.findOneAndUpdate(
                { userId: target.id, guildId: interaction.guild.id },
                { $inc: { balance: amount } },
                { upsert: true }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('💸 Перевод выполнен')
                .setDescription(`Вы перевели ${amount} ${config.currency} пользователю ${target.username}`)
                .setFooter({ text: `Отправитель: ${interaction.user.username}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при переводе денег',
                ephemeral: true 
            });
        }
    },
};