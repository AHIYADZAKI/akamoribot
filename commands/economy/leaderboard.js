const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Топ 10 самых богатых пользователей')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Тип баланса для отображения')
                .addChoices(
                    { name: 'Наличные', value: 'balance' },
                    { name: 'Банк', value: 'bank' },
                    { name: 'Общий', value: 'total' }
                )
                .setRequired(false)),
    async execute(interaction) {
        const type = interaction.options.getString('type') || 'total';

        try {
            let sortCriteria = {};
            if (type === 'balance') sortCriteria = { balance: -1 };
            else if (type === 'bank') sortCriteria = { bank: -1 };
            else sortCriteria = { $expr: { $add: ["$balance", "$bank"] } };

            const users = await User.find({ guildId: interaction.guild.id })
                .sort(sortCriteria)
                .limit(10);

            if (users.length === 0) {
                return interaction.reply({ 
                    content: '🏆 На сервере пока нет пользователей с деньгами',
                    ephemeral: true 
                });
            }

            const leaderboard = await Promise.all(users.map(async (user, index) => {
                const member = await interaction.guild.members.fetch(user.userId).catch(() => null);
                const username = member ? member.user.username : 'Неизвестный пользователь';
                let amount = 0;
                
                if (type === 'balance') amount = user.balance;
                else if (type === 'bank') amount = user.bank;
                else amount = user.balance + user.bank;

                return `**${index + 1}.** ${username} - ${amount} ${config.currency}`;
            }));

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`🏆 Топ 10 самых богатых пользователей`)
                .setDescription(leaderboard.join('\n'))
                .setFooter({ 
                    text: type === 'balance' ? 'Наличные' : 
                          type === 'bank' ? 'Банк' : 'Общий баланс' 
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при загрузке таблицы лидеров',
                ephemeral: true 
            });
        }
    },
};