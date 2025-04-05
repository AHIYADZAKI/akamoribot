const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Guild = require('../../systems/database/models/Guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-level')
        .setDescription('Показать уровень и опыт гильдии')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Название гильдии (оставьте пустым для своей гильдии)')
                .setRequired(false)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const userId = interaction.user.id;

        try {
            let guild;
            if (name) {
                guild = await Guild.findOne({ name });
            } else {
                guild = await Guild.findOne({ 
                    $or: [
                        { leaderId: userId },
                        { members: userId }
                    ]
                });
            }

            if (!guild) {
                return interaction.reply({ 
                    content: '❌ Гильдия не найдена!', 
                    ephemeral: true 
                });
            }

            const xpNeeded = guild.level * 1000;
            const progress = Math.min((guild.experience / xpNeeded) * 100, 100);
            const progressBar = createProgressBar(progress);

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`📊 Уровень гильдии ${guild.name}`)
                .addFields(
                    { name: 'Текущий уровень', value: guild.level.toString(), inline: true },
                    { name: 'Опыт', value: `${guild.experience}/${xpNeeded}`, inline: true },
                    { name: 'Прогресс', value: `${progressBar} ${progress.toFixed(1)}%`, inline: false }
                )
                .setFooter({ text: `Используйте /guild-upgrade для повышения уровня` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при получении информации', 
                ephemeral: true 
            });
        }
    },
};

function createProgressBar(percentage) {
    const filled = '▰';
    const empty = '▱';
    const total = 10;
    const filledCount = Math.round(total * (percentage / 100));
    return filled.repeat(filledCount) + empty.repeat(total - filledCount);
}