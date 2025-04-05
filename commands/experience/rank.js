const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Показать уровень и опыт пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для проверки')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        
        try {
            const user = await User.findOne({ 
                userId: target.id, 
                guildId: interaction.guild.id 
            }) || { xp: 0, level: 1 };

            const xpNeeded = Math.pow(user.level * 10, 2);
            const progress = Math.min((user.xp / xpNeeded) * 100, 100);
            const progressBar = createProgressBar(progress);

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`🏆 Прогресс ${target.username}`)
                .setThumbnail(target.displayAvatarURL())
                .addFields(
                    { name: 'Уровень', value: user.level.toString(), inline: true },
                    { name: 'Опыт', value: `${user.xp}/${xpNeeded}`, inline: true },
                    { name: 'Прогресс', value: `${progressBar} ${progress.toFixed(1)}%`, inline: false }
                )
                .setFooter({ text: `Запрошено ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при проверке ранга',
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