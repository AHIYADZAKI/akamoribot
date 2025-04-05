const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { User, Guild } = require('../../systems/database/models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-deposit')
        .setDescription('Пополнить казну гильдии')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма для внесения')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const userId = interaction.user.id;

        try {
            const user = await User.findOne({ userId, guildId: interaction.guild.id });
            const guild = await Guild.findOne({ members: userId });

            if (!guild) {
                return interaction.reply({ 
                    content: '❌ Вы не состоите в гильдии!', 
                    ephemeral: true 
                });
            }

            if (!user || user.balance < amount) {
                return interaction.reply({ 
                    content: '❌ У вас недостаточно средств!', 
                    ephemeral: true 
                });
            }

            user.balance -= amount;
            guild.balance += amount;
            
            await user.save();
            await guild.save();

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`💰 Внесение в казну гильдии ${guild.name}`)
                .setDescription(`Вы внесли ${amount} ${config.currency} в казну гильдии`)
                .addFields(
                    { name: 'Новый баланс гильдии', value: `${guild.balance} ${config.currency}`, inline: true },
                    { name: 'Ваш баланс', value: `${user.balance} ${config.currency}`, inline: true }
                )
                .setFooter({ text: `Используйте /guild-withdraw для снятия средств (лидер)` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при внесении средств', 
                ephemeral: true 
            });
        }
    },
};