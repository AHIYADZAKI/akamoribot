const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('/home/container/config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Проверить баланс')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для проверки баланса')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        
        try {
            let user = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
            if (!user) {
                user = new User({
                    userId: target.id,
                    guildId: interaction.guild.id,
                    balance: 0,
                    bank: 0
                });
                await user.save();
            }

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`💰 Баланс ${target.username}`)
                .addFields(
                    { name: 'Наличные', value: `${user.balance} ${config.currency}`, inline: true },
                    { name: 'Банк', value: `${user.bank} ${config.currency}`, inline: true },
                    { name: 'Общий баланс', value: `${user.balance + user.bank} ${config.currency}` }
                )
                .setThumbnail(target.displayAvatarURL())
                .setFooter({ text: `Запрошено ${interaction.user.username}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при проверке баланса',
                ephemeral: true 
            });
        }
    },
};