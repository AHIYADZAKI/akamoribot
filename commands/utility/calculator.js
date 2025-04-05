const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculator')
        .setDescription('Произвести математические вычисления')
        .addStringOption(option =>
            option.setName('expression')
                .setDescription('Математическое выражение (например, 2+2*3)')
                .setRequired(true)),
    async execute(interaction) {
        const expression = interaction.options.getString('expression');

        try {
            // Безопасное вычисление выражения
            const result = eval(expression.replace(/[^-()\d/*+.]/g, ''));

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🧮 Калькулятор')
                .addFields(
                    { name: 'Выражение', value: expression, inline: true },
                    { name: 'Результат', value: result.toString(), inline: true }
                )
                .setFooter({ text: `Запрошено ${interaction.user.tag}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Неверное математическое выражение', 
                ephemeral: true 
            });
        }
    },
};