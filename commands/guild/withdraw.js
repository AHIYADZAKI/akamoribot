const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { User, Guild } = require('../../systems/database/models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-withdraw')
        .setDescription('Снять средства из казны гильдии (только для лидера)')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма для снятия')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const userId = interaction.user.id;

        try {
            const guild = await Guild.findOne({ leaderId: userId });
            const user = await User.findOne({ userId, guildId: interaction.guild.id });

            if (!guild) {
                return interaction.reply({ 
                    content: '❌ Вы не являетесь лидером гильдии!', 
                    ephemeral: true 
                });
            }

            if (guild.balance < amount) {
                return interaction.reply({ 
                    content: '❌ В казне гильдии недостаточно средств!', 
                    ephemeral: true 
                });
            }

            guild.balance -= amount;
            user.balance += amount;
            
            await guild.save();
            await user.save();

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`💰 Снятие средств из казны ${guild.name}`)
                .setDescription(`Вы сняли ${amount} ${config.currency} из казны гильдии`)
                .addFields(
                    { name: 'Остаток в казне', value: `${guild.balance} ${config.currency}`, inline: true },
                    { name: 'Ваш баланс', value: `${user.balance} ${config.currency}`, inline: true }
                )
                .setFooter({ text: `Используйте /guild-deposit для пополнения казны` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при снятии средств', 
                ephemeral: true 
            });
        }
    },
};