const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Guild = require('../../systems/database/models/Guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-upgrade')
        .setDescription('Повысить уровень гильдии'),
    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            const guild = await Guild.findOne({ leaderId: userId });

            if (!guild) {
                return interaction.reply({ 
                    content: '❌ Вы не являетесь лидером гильдии!', 
                    ephemeral: true 
                });
            }

            const xpNeeded = guild.level * 1000;
            if (guild.experience < xpNeeded) {
                return interaction.reply({ 
                    content: `❌ Недостаточно опыта для повышения уровня (нужно ${xpNeeded})!`, 
                    ephemeral: true 
                });
            }

            guild.level += 1;
            guild.experience = 0;
            await guild.save();

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`🎉 Гильдия ${guild.name} повысила уровень!`)
                .setDescription(`Новый уровень: ${guild.level}`)
                .setFooter({ text: `Поздравляем всех участников!` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при повышении уровня', 
                ephemeral: true 
            });
        }
    },
};